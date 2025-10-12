import transporter from '@/config/nodemailer';
import logger from '@/utils/logger';


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