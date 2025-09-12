const mongoose = require('mongoose');

const adoptablePetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    healthStatus: { type: String, required: true },
    images: [{ type: String }],
    careLogs: [{
        date: { type: Date, default: Date.now },
        activity: { type: String, enum: ['feeding', 'grooming', 'medical'] },
        notes: String
    }],
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelter',
        required: true
    },
    isAdopted: { type: Boolean, default: false },
}, { timestamps: true });

const adoptablePetModel = mongoose.model('AdoptablePet', adoptablePetSchema)
module.exports = adoptablePetModel;