import express from 'express';
import usersRouter from './routes/users';
import mongoose from 'mongoose';
import config from './config';
import cors from 'cors';
import usersCrmRouter from "./routes/usersCrm";
const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth/users', usersRouter);
app.use('/auth/usersCrm', usersCrmRouter);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(config.port, () => {
        console.log('connecting port: ' + config.port);
    });

    process.on('exit', () => {
        mongoose.disconnect();
        console.log('disconnected');
    });
};

void run();