import { sendOTPService } from "@/lib/services/otpService";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import dbConnect from "@/lib/dbConnect";

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            message: 'Method not allowed' 
        });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
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
        return res.status(500).json({
            success: false,
            message: 'Email service is not properly configured'
        });
    }

    try {
        // Connect to database
        await dbConnect();

        // Send OTP using service
        const result = await sendOTPService(email, 'email_verification');

        if (!result.success) {
            return res.status(429).json(result); // 429 Too Many Requests
        }

        res.status(200).json(result);

    } catch (error) {
        // More specific error messages
        let errorMessage = 'Failed to send OTP. Please try again.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please check email configuration.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Failed to connect to email service.';
        } else if (error.message?.includes('Invalid login')) {
            errorMessage = 'Email service authentication failed.';
        } else if (error.message?.includes('E11000')) {
            errorMessage = 'OTP request in progress. Please wait.';
        }

        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});
