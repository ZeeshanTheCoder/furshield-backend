const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // vetId / productId / shelterId
    targetType: {
        type: String,
        enum: ['vet', 'product', 'shelter'],
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String,
}, { timestamps: true });

// Index for faster lookup
ratingSchema.index({ targetId: 1, targetType: 1 });

const reviewsAndRatingModel = mongoose.model('ReviewsAndRating', ratingSchema);

module.exports = reviewsAndRatingModel;