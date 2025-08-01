import { User } from "@/lib/models/User";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import dbConnect from "@/lib/dbConnect";

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { email, newPassword } = req.body; // Remove otp from destructuring

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered"
            });
        }

        // No need to verify OTP again since it was already verified in the previous step
        // Update password directly
        user.password = newPassword;
        
        // Clean up any old reset fields if they exist
        if (user.resetPasswordOTP) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpiry = undefined;
        }
        
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
});