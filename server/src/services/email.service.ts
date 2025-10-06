// services/emailService.ts
import nodemailer from 'nodemailer';
import logger from '@/utils/logger';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Send email
export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to}`);
    } catch (error) {
        logger.error('Error sending email', error);
        throw error;
    }
};