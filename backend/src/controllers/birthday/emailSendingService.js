const nodemailer = require('nodemailer');
require('dotenv').config();

// Using your provided transporter configuration.
// Note: For production, it's recommended to move user and pass to environment variables
// to avoid committing them directly into your code.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dhruvboghani624@gmail.com', // Your Gmail address
        pass: 'ampf tloo ipml qytm'      // Your Gmail App Password
    }
});

/**
 * Sends an email with a PDF attachment.
 * @param {string} toEmail The recipient's email address.
 * @param {string} subject The subject of the email.
 * @param {string} studentName The name of the student for the email body.
 * @param {Buffer} pdfBuffer The PDF buffer to attach.
 */
const sendEmailWithAttachment = async (toEmail, subject, studentName, pdfBuffer) => {
    try {
        await transporter.sendMail({
            from: `"Greenwood International School" <dhruvboghani624@gmail.com>`, // Use your email here as the sender
            to: toEmail,
            subject: subject,
            html: `<p>Dear Parent,</p><p>Please find attached a special birthday wish for ${studentName}.</p><p>Warm regards,<br/>The School Administration</p>`,
            attachments: [
                {
                    filename: `birthday_card_${studentName.replace(' ', '_')}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });
        console.log(`✅ Birthday email sent to ${toEmail}`);
    } catch (err) {
        console.error(`❌ Failed to send email to ${toEmail}:`, err);
    }
};

module.exports = { sendEmailWithAttachment };

