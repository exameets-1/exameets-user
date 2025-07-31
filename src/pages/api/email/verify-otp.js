import { verifyOTPService } from '@/lib/services/otpService';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import dbConnect from '@/lib/dbConnect';

export default catchAsync(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            message: 'Method not allowed' 
        });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
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

    // Validate OTP format
    if (!/^\d{6}$/.test(otp.toString())) {
        return res.status(400).json({
            success: false,
            message: 'OTP must be a 6-digit number'
        });
    }

    try {
        // Connect to database
        await dbConnect();

        // Verify OTP using service
        const result = await verifyOTPService(email, otp.toString(), 'email_verification');

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("Email Verification Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again."
        });
    }
})
