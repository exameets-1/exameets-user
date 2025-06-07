import { sendEmail } from "@/utils/sendEmail";
import { storeOTP } from "@/lib/otpStore";
import { catchAsync } from "@/lib/middlewares/catchAsync";

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP
        storeOTP(email, otp);

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
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again.'
        });
    }
});
