// Memory cache for OTP storage (fallback for serverless environments)
let memoryCache = {};

// Clean expired OTPs from memory cache
const cleanExpiredOTPs = () => {
    const now = Date.now();
    Object.keys(memoryCache).forEach(email => {
        if (memoryCache[email].expiry <= now) {
            delete memoryCache[email];
        }
    });
};

export const storeOTPInMemory = (email, otp) => {
    cleanExpiredOTPs();
    memoryCache[email] = {
        otp,
        expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    console.log(`OTP stored in memory for email: ${email}`);
};

export const verifyOTPFromMemory = (email, otp) => {
    cleanExpiredOTPs();
    const storedData = memoryCache[email];
    
    if (!storedData) {
        return {
            valid: false,
            message: "OTP has expired or not sent. Please request a new OTP"
        };
    }

    if (Date.now() > storedData.expiry) {
        delete memoryCache[email];
        return {
            valid: false,
            message: "OTP has expired. Please request a new OTP"
        };
    }

    if (storedData.otp !== otp) {
        return {
            valid: false,
            message: "Invalid OTP"
        };
    }

    // Clear OTP after successful verification
    delete memoryCache[email];
    return {
        valid: true,
        message: "OTP verified successfully"
    };
};
