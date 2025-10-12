import _config from '@/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: _config.ENV.SMTP_USER,
        pass: _config.ENV.SMTP_PASS,
    },
});

export default transporter;