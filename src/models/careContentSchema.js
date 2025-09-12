const mongoose = require('mongoose');

const careContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['article', 'video', 'faq'],
        required: true
    },
    category: {
        type: String,
        enum: ['feeding', 'hygiene', 'exercise', 'training', 'health'],
        required: true
    },
    content: { type: String, required: true },
    videoUrl: String, // optional for videos
}, { timestamps: true });

const careContentModel = mongoose.model('CareContent', careContentSchema);

module.exports = careContentModel;