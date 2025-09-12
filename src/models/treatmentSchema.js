const mongoose = require('mongoose');

const treatmentLogSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    vetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    symptoms: [String],
    diagnosis: { type: String, required: true },
    prescription: String,
    followUpDate: Date,
    labResults: [{ type: String }], // file URLs
}, { timestamps: true });

const treatmentLogModel = mongoose.model('TreatmentLog', treatmentLogSchema)

module.exports = treatmentLogModel;