const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const userModel = require('../models/user.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');




/**
 * - Create a new transaction
 * - The 10-STEP TRANSFER FLOW:
     * 1.  Validate request
     * 2.  Validate idempotencyKey
     * 3.  Check Account Status
     * 4.  Derive sender balance from ledger
     * 5.  Create Transaction (Pending)
     * 6.  Create Debit Ledger Entry
     * 7.  Create Credit Ledger Entry
     * 8.  Mark Transaction as Completed
     * 9.  Commit MongoDB Session
     * 10. Send email notification
 */

async function createTransaction(req, res) {
    /**
     * step 1: validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,

    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })


    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Account not found"
        })
    }

    /**
     * step 2: validate IdempotencyKey
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if (!isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing"
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please try again",
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please try again",
            })
        }
    }

    /**
     * step 3: check account status
     */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Account is not active"
        })
    }

    /**
     * step 4: derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Available balance is ${balance}. Requested balance is ${amount}`
        })
    }

    let transaction;
    try{

    /**
     * step 5: create transaction
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    }], { session }))[0];

    /**
     * step 6: create debit ledger entry
     */
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    }], { session });
    
    /**
     * step 6.5: simulate a short delay to mimic processing time
     */
    await (() => {
        return new Promise((resolve) => setTimeout(resolve, 200));
    })();

    /**
     * step 7: create credit ledger entry
     */
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    }], { session });

    /**
     * step 8: mark transaction as completed
     */
    await transactionModel.findOneAndUpdate({
        _id: transaction._id
    }, {
        status: "COMPLETED"
    }, { session });

    /**
     * step 9: commit mongo session
     */
    await session.commitTransaction();
    session.endSession();
}catch(err){

    return res.status(500).json({
        message: "Transaction processing failed, please try again later",
    })
}
    /**
     * step 10: send email notification
     */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })


}

async function createInitialFundsTransaction(req, res) {

    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Account not found"
        })
    }

    // Check Idempotency Key
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            });
        }
    }

    // Find or create System Bank Reserve User
    let systemUser = await userModel.findOne({ systemUser: true });
    if (!systemUser) {
        systemUser = await userModel.create({
            name: "System Reserve Vault",
            email: "system@ledger.internal",
            password: "SystemVaultPassword123!",
            systemUser: true
        });
    }

    // Find or create System Vault Account
    let systemAccount = await accountModel.findOne({
        user: systemUser._id
    });

    if (!systemAccount) {
        systemAccount = await accountModel.create({
            user: systemUser._id,
            status: "ACTIVE",
            currency: toUserAccount.currency || "INR"
        });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const transaction = new transactionModel({
            fromAccount: systemAccount._id,
            toAccount,
            amount: Number(amount),
            idempotencyKey,
            status: "PENDING",
        });
        await transaction.save({ session });
        
        // Debit System Reserve Vault
        const debitLedgerEntry = await ledgerModel.create([{
            account: systemAccount._id,
            amount: Number(amount),
            transaction: transaction._id,
            type: "DEBIT",
        }], { session });

        // Credit Target User Account
        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: Number(amount),
            transaction: transaction._id,
            type: "CREDIT",
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction: transaction
        });
    } catch (err) {
        console.error("Initial funds error:", err);
        return res.status(500).json({
            message: err.message || "Failed to process initial funds deposit"
        });
    }
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}