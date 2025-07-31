import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensures only one OTP per email at a time
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset'],
        default: 'email_verification'
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3 // Limit verification attempts
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // TTL: 5 minutes (300 seconds)
    }
});

// Index for better performance
otpSchema.index({ email: 1 });
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default Otp;
