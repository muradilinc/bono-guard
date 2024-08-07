import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import UserCrm from "./models/UserCRM";

const dropCollection = async (
    db: mongoose.Connection,
    collectionName: string,
) => {
    try {
        await db.dropCollection(collectionName);
    } catch (e) {
        console.log(`Collection ${collectionName} was missing, skipping drop...`);
    }
};

const run = async () => {
    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    const collections = ['users', 'usercrms'];

    for (const collectionName of collections) {
        await dropCollection(db, collectionName);
    }

    await User.create({
        email: 'bonobarmainpanel@gmail.com',
        password: '427170main',
        token: crypto.randomUUID(),
    });

    await UserCrm.create({
        email: 'bonobarcrm@gmail.com',
        password: 'bonobarcrm170724',
        token: crypto.randomUUID(),
    });
    await db.close();
}

void run();