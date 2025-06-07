// pages/api/auth/register.js
import dbConnect from '@/lib/dbConnect';
import { User } from '@/lib/models/User';
import { sendToken } from '@/utils/jwtToken';

export default async function handler(req, res) {
    try {
        // Connect to database
        await dbConnect();

        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed'
            });
        }

        const { name, email, password, phone, dob, gender } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone || !dob || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all required fields'
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            dob,
            gender
        });

        // Send token and response
        sendToken(user, 201, res, 'Registered Successfully');

    } catch (error) {

    // Handle duplicate key error gracefully
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `Phone number already registered.`
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.'
    });
}
}

// Configure API to handle larger payloads if needed
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
}