require('dotenv').config();
const nodemailer = require('nodemailer');

const hasAppPassword = Boolean(process.env.EMAIL_PASS && process.env.EMAIL_PASS.trim());
const hasOAuth = Boolean(process.env.REFRESH_TOKEN && process.env.CLIENT_ID && process.env.CLIENT_SECRET);

let transporter = null;

if (hasAppPassword) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
} else if (hasOAuth) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    });
}

if (transporter) {
    transporter.verify((error, success) => {
        if (error) {
            console.warn('⚠️  Email server connection warning:', error.message || error);
            console.warn('   To fix: add your Gmail App Password as EMAIL_PASS in backend/.env or refresh your OAuth2 token.');
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });
} else {
    console.warn('⚠️  No valid email credentials found in .env. Email notifications are currently disabled.');
}

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    if (!transporter) {
        console.warn('⚠️  Email not sent: Email transporter is not configured in .env');
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error.message || error);
    }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';

    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.
    We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;

    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger.
    We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount){
    const subject = 'Transaction Successful';
    const text = `Hello ${name},\n\nYour transaction of ${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of ${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

    async function sendTransactionFailedEmail(userEmail, name, amount, toAccount){
    const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nYour transaction of ${amount} to account ${toAccount} failed.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of ${amount} to account ${toAccount} failed.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailedEmail
}