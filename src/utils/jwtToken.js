import { serialize } from 'cookie';

export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    
    // Cookie options with more permissive settings for development
    const options = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
    };

    // Remove password from user object before sending
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    // Set cookie header
    res.setHeader('Set-Cookie', serialize('token', token, options));
    
    // Send response
    res.status(statusCode).json({
        success: true,
        token,
        user: userWithoutPassword,
        message
    });
};