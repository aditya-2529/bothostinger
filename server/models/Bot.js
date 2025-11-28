const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    deploymentId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repoUrl: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['QUEUED', 'BUILDING', 'RUNNING', 'STOPPED', 'FAILED'],
        default: 'QUEUED'
    },
    containerId: { type: String }, // Useful to store the actual Docker ID
    logs: { type: Array, default: [] }, // (Optional) To store build logs later
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', botSchema);