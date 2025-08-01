import { User } from "@/lib/models/User";
import { sendOTPService } from "@/lib/services/otpService";
import dbConnect from "@/lib/dbConnect";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered"
            });
        }

        // Use the new OTP service for password reset
        const result = await sendOTPService(email, 'password_reset');

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                timeLeft: result.timeLeft
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email"
        });
    } catch (error) {
        console.error("Password reset OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send password reset OTP"
        });
    }
});