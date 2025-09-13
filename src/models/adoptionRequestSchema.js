const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptablePet',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    message: String,
    respondedAt: Date,
}, { timestamps: true });

const adoptionRequestModel = mongoose.model('AdoptionRequest', adoptionRequestSchema)

module.exports = adoptionRequestModel;