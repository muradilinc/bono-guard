import {configDotenv} from "dotenv";

const envFile = process.env['NODE_ENV'] ? `.env.${process.env['NODE_ENV']}` : '.env';

configDotenv({ path: envFile });

const rootPath = __dirname;
const config = {
    rootPath,
    mongoose: {
        db: 'mongodb://localhost/markets',
    },
};

export default config;