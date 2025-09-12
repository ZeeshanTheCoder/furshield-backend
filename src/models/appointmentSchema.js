const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet',
        required: true
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rescheduled', 'completed'],
        default: 'pending'
    },
    reason: { type: String, required: true },
    notes: String,
}, { timestamps: true });

const appointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = appointmentModel;