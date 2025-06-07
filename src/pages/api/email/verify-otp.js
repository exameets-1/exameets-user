import { verifyOTP } from '@/lib/otpStore';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const result = verifyOTP(email, otp);

        if (!result.valid) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error("Email Verification Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})
