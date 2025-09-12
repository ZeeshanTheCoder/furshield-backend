const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true }, // e.g., Dog, Cat
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    medicalHistory: [String], // optional array of notes
    gallery: [{ type: String }], // array of image URLs
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const petModel = mongoose.model('Pet', petSchema);
module.exports = petModel;