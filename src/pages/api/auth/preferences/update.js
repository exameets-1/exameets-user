import dbConnect from '@/lib/dbConnect';
import { User } from '@/lib/models/User';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import jwt from 'jsonwebtoken';

export default catchAsync(async (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Get token from cookies
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Get user
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const {
            notifications_about,
            isStudying,
            educationLevel,
            preferencesSet
        } = req.body;

        // Update user preferences
        user.preferences = {
            notifications_about: notifications_about || user.preferences?.notifications_about,
            isStudying: isStudying !== undefined ? isStudying : user.preferences?.isStudying,
            educationLevel: educationLevel || user.preferences?.educationLevel,
            preferencesSet: preferencesSet || user.preferences?.preferencesSet
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Preferences updated successfully",
            user
        });

    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating preferences"
        });
    }
});

// Configure API to handle larger payloads if needed
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
}