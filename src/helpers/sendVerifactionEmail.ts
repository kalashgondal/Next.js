import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerifactionEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerifactionEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Next-js project',
            to: email,
            subject: 'Mstry message | Verifaction code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Verification email send successfully' }
    } catch (emailError) {
        console.error("Error sending verifaction email", emailError);
        return { success: false, message: 'Falid to send verification email' }
    }
}