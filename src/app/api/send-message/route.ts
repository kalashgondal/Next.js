import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { Message } from "@/Model/User";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        // is user accepting the message
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages",
            }, { status: 403 });
        }

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
        }, { status: 401 });

    } catch (error) {
        console.log("An unexpeted error occured: ",error);
        
        return Response.json({
            success: false,
            message: "Not Authenticated",
        }, { status: 500 });
    }
}