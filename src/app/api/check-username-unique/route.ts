import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { z } from 'zod';
import { usernameValidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };

        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); // TODO: remove

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join('.') : 'Invalid query parameters',
            }, { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUsers = await UserModel.find({ username, isVerified: true });

        if (existingVerifiedUsers.length > 0) {
            return Response.json({
                success: false,
                message: 'Username is already taken',
            }, { status: 400 }
            );
        }

        return Response.json({
            success: true,
            message: 'Username is unique',
        }, { status: 200 }
        );

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 }
        );
    }
}
