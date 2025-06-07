import dbConnect from '@/lib/dbConnect';
import { User } from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export default catchAsync(async (req, res) => {
    if (req.method !== 'GET') {
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
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
                algorithms: ["HS256"],
                ignoreExpiration: false
            });
            
            // Get user details
            const user = await User.findById(decoded._id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                user
            });

        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            } else if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired"
                });
            }
            throw jwtError;
        }

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
})
