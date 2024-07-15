import express from 'express';
import User from '../models/User';
import mongoose from 'mongoose';
import {transporter} from "../mailer";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
        });

        user.generateToken();
        await user.save();
        return res.send({ message: 'user registered!', user });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidatorError) {
            return res.status(422).send(error);
        }
        return next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(422).send({ error: 'Username or Password not found!' });
        }

        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.status(422).send({ error: 'Username or Password not found!' });
        }

        user.generateToken();
        await user.save();
        return res.send({ message: 'User login!', user });
    } catch (error) {
        return next(error);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const headerValue = req.get('Authorization');
        const successMessage = { message: 'Success!' };

        if (!headerValue) {
            return res.send({ ...successMessage, stage: 'No header' });
        }

        const [_bearer, token] = headerValue.split(' ');

        if (!token) {
            return res.send({ ...successMessage, stage: 'No token' });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.send({ ...successMessage, stage: 'No user' });
        }

        user.generateToken();
        await user.save();

        return res.send({ ...successMessage, stage: 'Success' });
    } catch (e) {
        return next(e);
    }
});

usersRouter.post('/send-otp', async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(422).send({ error: 'Пользователь не найден' });
        }

        const otp = Math.floor(Math.random() * 900000).toString();

        user.otp = otp;

        await user.save();

        const mailOptions = {
            from: process.env['USER_MAILER'],
            to: email,
            subject: 'Your OTP Code to Bono',
            text: `Ваш OTP код ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, _info) => {
            if (error) {
                return next(error);
            } else {
                return res.status(200).send({ message: `OTP отправлен на ${req.body.email}` });
            }
        });
    } catch (e) {
        return next(e);
    }
});

usersRouter.post('/compare-otp', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const otp = req.body.otp;

        if (user?.otp !== otp) {
            return res.status(422).send({ error: 'Неверный Otp' });
        }

        return res.status(200).send({ message: 'Success' });
    } catch (e) {
        return next(e);
    }
});

usersRouter.post('/change-password', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(422).send({ error: 'Пользователь не найден' });
        }

        user.password = password;
        user.generateToken();

        await user.save();

        return res.send({ message: 'Пароль изменен' });
    } catch (e) {
        return next(e);
    }
});

export default usersRouter;