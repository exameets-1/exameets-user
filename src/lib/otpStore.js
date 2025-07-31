import fs from 'fs';
import path from 'path';

const OTP_STORE_PATH = path.join(process.cwd(), 'tmp', 'otpStore.json');

// Ensure the tmp directory exists
const ensureTmpDir = () => {
    try {
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
    } catch (error) {
        console.error('Error creating tmp directory:', error);
        throw new Error('Failed to initialize storage directory');
    }
};

// Initialize store file if it doesn't exist
const initializeStore = () => {
    try {
        ensureTmpDir();
        if (!fs.existsSync(OTP_STORE_PATH)) {
            fs.writeFileSync(OTP_STORE_PATH, JSON.stringify({}));
        }
    } catch (error) {
        console.error('Error initializing OTP store:', error);
        throw new Error('Failed to initialize OTP storage');
    }
};

const readStore = () => {
    try {
        initializeStore();
        const data = fs.readFileSync(OTP_STORE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading OTP store:', error);
        return {};
    }
};

const writeStore = (data) => {
    try {
        ensureTmpDir();
        fs.writeFileSync(OTP_STORE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to OTP store:', error);
        throw new Error('Failed to store OTP');
    }
};

export const storeOTP = async (email, otp) => {
    try {
        const store = readStore();
        store[email] = {
            otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
        };
        writeStore(store);
        console.log(`OTP stored for email: ${email}`);
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw new Error('Failed to store OTP');
    }
};

export const verifyOTP = (email, otp) => {
    const store = readStore();
    const storedData = store[email];
    
    if (!storedData) {
        return {
            valid: false,
            message: "OTP has expired or not sent. Please request a new OTP"
        };
    }

    if (Date.now() > storedData.expiry) {
        delete store[email];
        writeStore(store);
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
    delete store[email];
    writeStore(store);
    return {
        valid: true,
        message: "OTP verified successfully"
    };
};