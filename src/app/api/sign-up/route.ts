import dbConnect from "@/lib/dbConect";
import UserModel from "@/Model/User";
import bcryptjs from "bcryptjs";
import { sendVerifactionEmail } from "@/helpers/sendVerifactionEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "User Name alredy taken",
                },
                { status: 400 }
            );
        }
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email",
                    },
                    { status: 400 }
                );
            } else {
                const hashPassword = await bcryptjs.hash(password, 100);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000);
                await existingUserByEmail.save();
            }
        } else {
            const hashPassword = await bcryptjs.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();
        }
        //send verifiationEmail
        const emailResponse = await sendVerifactionEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "User registerd successfully please verify your email",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}