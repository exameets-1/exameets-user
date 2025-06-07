import { User } from "@/lib/models/User";
import { sendEmail } from "@/utils/sendEmail";
import dbConnect from "@/lib/dbConnect";
import { catchAsync } from "@/lib/middlewares/catchAsync";

// Generate OTP function
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default catchAsync(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "Email is not registered"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Save OTP and its expiry in user document
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save();

        // Send email
        const message = `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`;
        await sendEmail({
            email: user.email,
            subject: "Password Reset OTP",
            message,
            type: 'login'
        });

        // console.log(`OTP sent to ${user.email}`);
        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
});

// import { User } from "@/lib/models/User";
// import { sendEmail } from "@/utils/sendEmail";
// import dbConnect from "@/lib/dbConnect";
// import { catchAsync } from "@/lib/middlewares/catchAsync";

// // Generate OTP function
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// export default catchAsync(async (req, res) => {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ success: false, message: 'Method not allowed' });
//     }

//     await dbConnect();

//     try {
//         const { email } = req.body;
        
//         if (!email) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email is required"
//             });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Email is not registered"
//             });
//         }

//         // Generate OTP
//         const otp = generateOTP();
        
//         // Save OTP and its expiry in user document
//         user.resetPasswordOTP = otp;
//         user.resetPasswordOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
//         await user.save();

//         // Send email with better error handling
//         try {
//             const message = `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`;
//             await sendEmail({
//                 email: user.email,
//                 subject: "Password Reset OTP",
//                 message,
//                 type: 'login'
//             });

//             console.log(`OTP sent successfully to ${user.email}`);
//             return res.status(200).json({
//                 success: true,
//                 message: "Password reset OTP sent to your email"
//             });
//         } catch (emailError) {
//             console.error('Email sending failed:', emailError);
            
//             // Clear the OTP from database if email failed
//             user.resetPasswordOTP = undefined;
//             user.resetPasswordOTPExpiry = undefined;
//             await user.save();
            
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to send email. Please try again later.",
//                 error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
//             });
//         }
//     } catch (error) {
//         console.error('Error in send-otp API:', error);
        
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });