require('dotenv').config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // MUST be false for port 2525
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

transport.verify((error) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transport.sendMail({
            from: `"Banking System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Banking System!';
    const text = `Hello ${name}, thank you for creating your account with our bank.`;
    const html = `<p>Hello ${name},</p><p>Thank you for creating your account with our bank.</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
};
