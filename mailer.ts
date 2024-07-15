import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user:' 04072002mu@gmail.com',
        pass: 'trjjtbwzcyhttika',
    },
});