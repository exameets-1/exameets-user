import { sendEmail } from "@/utils/sendEmail";
import { storeOTP } from "@/lib/otpStore";
import { storeOTPInMemory } from "@/lib/otpMemoryStore";
import { catchAsync } from "@/lib/middlewares/catchAsync";

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    // Check for required environment variables
    const requiredEnvVars = [
        'SMTP_HOST',
        'SMTP_SERVICE', 
        'SMTP_PORT',
        'SMTP_MAIL_SIGNIN',
        'SMTP_PASSWORD_SIGNIN'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
        console.error('Missing environment variables:', missingEnvVars);
        return res.status(500).json({
            success: false,
            message: 'Email service is not properly configured'
        });
    }

    try {
        // Generate OTP
        const otp = generateOTP();
        
        // Try to store OTP in file system, fallback to memory
        try {
            await storeOTP(email, otp);
        } catch (fileError) {
            console.warn('File storage failed, using memory storage:', fileError.message);
            storeOTPInMemory(email, otp);
        }

        // Send email
        await sendEmail({
            email: email,
            subject: 'Email Verification OTP',
            message: `Your OTP for email verification is: ${otp}. This OTP will expire in 5 minutes.`,
            type: 'signin'
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Send OTP Error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        // More specific error messages
        let errorMessage = 'Failed to send OTP. Please try again.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please check email configuration.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Failed to connect to email service.';
        } else if (error.message?.includes('Invalid login')) {
            errorMessage = 'Email service authentication failed.';
        }

        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});
