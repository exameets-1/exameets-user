import { catchAsync } from "@/lib/middlewares/catchAsync";

export default catchAsync(async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Check environment variables (without exposing sensitive data)
    const envCheck = {
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_SERVICE: !!process.env.SMTP_SERVICE,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_MAIL_SIGNIN: !!process.env.SMTP_MAIL_SIGNIN,
        SMTP_PASSWORD_SIGNIN: !!process.env.SMTP_PASSWORD_SIGNIN,
        // Show values for non-sensitive vars
        SMTP_HOST_VALUE: process.env.SMTP_HOST,
        SMTP_SERVICE_VALUE: process.env.SMTP_SERVICE,
        SMTP_PORT_VALUE: process.env.SMTP_PORT,
    };

    const missingVars = Object.entries(envCheck)
        .filter(([key, value]) => key.includes('SMTP_') && !key.includes('_VALUE') && !value)
        .map(([key]) => key);

    res.status(200).json({
        success: true,
        environment: envCheck,
        missingVariables: missingVars,
        allConfigured: missingVars.length === 0
    });
});
