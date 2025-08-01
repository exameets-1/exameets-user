import { User } from "@/lib/models/User";
import { verifyOTPService } from "@/lib/services/otpService";
import dbConnect from "@/lib/dbConnect";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { email, otp } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered"
            });
        }

        // Use the new OTP verification service (don't delete OTP yet)
        const result = await verifyOTPService(email, otp, 'password_reset', false);

        if (!result.success) {
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
        console.error("OTP verification error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP"
        });
    }
});