import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username in required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email in required"],
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password in required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code in required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry in required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.
    Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;