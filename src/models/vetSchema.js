const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // One vet profile per user
    },
    specialization: { type: String, required: true }, // e.g., "Dermatology"
    experience: { type: Number, required: true }, // in years
    availableSlots: [{
        day: String,   // e.g., "Monday"
        time: String   // e.g., "9:00 AM - 5:00 PM"
    }]
}, { timestamps: true });

const vetModel = mongoose.model('Vet', vetSchema);

module.exports = vetModel;
