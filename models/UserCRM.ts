import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {HydratedDocument} from 'mongoose';
import {UserFields, UserMethods, UserModel} from '../types';
import {randomUUID} from 'crypto';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const userCrmSchema = new Schema<UserFields, UserModel, UserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (
                this: HydratedDocument<UserFields>,
                email: string,
            ): Promise<boolean> {
                if (!this.isModified('email')) return true;

                const user: HydratedDocument<UserFields> | null = await UserCrm.findOne({
                    email,
                });

                return !user;
            },
            message: 'This user is already registered!',
        },
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    otp: String
});

userCrmSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

userCrmSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

userCrmSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userCrmSchema.set('toJSON', {
    transform: (_doc, ret, _options) => {
        delete ret.password;
        return ret;
    },
});

const UserCrm = mongoose.model<UserFields, UserModel>('UserCrm', userCrmSchema);
export default UserCrm;