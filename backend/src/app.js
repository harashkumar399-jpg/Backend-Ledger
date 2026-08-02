const express = require('express');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');


const app = express();
exports.app = app;

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Ledger API');
});

module.exports = app;