import { Model } from 'mongoose';

export interface UserFields {
    email: string;
    password: string;
    token: string;
    otp: string;
}

export interface UserMethods {
    generateToken(): void;
    checkPassword(password: string): Promise<boolean>;
}

export type UserModel = Model<UserFields, unknown, UserMethods>;