import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";




export async function sendVerificationEmail(
    email: string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        console.log('Attempting to send email to:', email, 'with code:', verifyCode);
        console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        
        const response = await resend.emails.send({
        from: 'Anonymous Chat <onboarding@resend.dev>',
        to: email,
        subject: "Mystery Message Verification code",
        react: VerificationEmail({username,otp:verifyCode}),
});
        
        console.log('Full Resend response:', response);
        
        if (response.error) {
            console.error('Resend error:', response.error);
            return {success: false, message: response.error.message || 'Resend error'};
        }
        
        if (!response.data || !response.data.id) {
            console.error('Resend returned invalid response:', response);
            return {success: false, message: 'Resend returned invalid response'};
        }
        
        console.log('Email sent successfully with ID:', response.data.id);
        return{success:true,message:`verification email sent successfully (id: ${response.data.id})`}
    } catch (emailError:any) {
        console.error("error sending verification email", emailError)
        console.error("Full error details:", {
            message: emailError?.message,
            statusCode: emailError?.statusCode,
            name: emailError?.name,
            stack: emailError?.stack
        });
        const msg = emailError?.message || 'failed to send verification email'
        return{success:false,message: msg}

        
    }
}