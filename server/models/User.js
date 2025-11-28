const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { 
        type: String, 
        enum: ['free', 'pro', 'enterprise'], 
        default: 'free' 
    },
    balance: { type: Number, default: 0.0 }, // The "Wallet" for paying $3/mo
    githubToken: { type: String }, // Optional: To access private repos later
    coins: { type: Number, default: 0 },
    adWatchesToday: { type: Number, default: 0 },
    lastAdDate: { type: Date, default: Date.now },
    termsAccepted: { type: Boolean, required: true, default: false },
    termsAcceptedAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);