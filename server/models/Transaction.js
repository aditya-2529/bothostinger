const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    utr: { type: String, required: true, unique: true },
    type: { 
        type: String, 
        enum: ['DEPOSIT', 'PURCHASE'], // <-- New field
        required: true 
    },
    description: { type: String }, // The Transaction ID
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'REJECTED'], 
        default: 'PENDING' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);