import express from 'express';
import usersRouter from './routes/users';
import mongoose from 'mongoose';
import config from './config';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log('connecting port: ' + port);
    });

    process.on('exit', () => {
        mongoose.disconnect();
        console.log('disconnected');
    });
};

void run();