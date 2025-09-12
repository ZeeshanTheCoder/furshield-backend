const reviewsAndRatingModel = require("../models/reviewsAndRatingSchema.js");

// ⭐ Create a review/rating
const createReview = async (req, res) => {
    try {
        const { userId, targetId, targetType, rating, comment } = req.body;

        if (!userId || !targetId || !targetType || !rating) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Check if user already rated this target
        const existingReview = await reviewsAndRatingModel.findOne({ userId, targetId, targetType });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this " + targetType });
        }

        const review = await reviewsAndRatingModel.create({
            userId,
            targetId,
            targetType,
            rating,
            comment
        });

        res.status(201).json({ message: "Review created successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✏️ Update a review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await reviewsAndRatingModel.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true }
        );

        if (!review) return res.status(404).json({ message: "Review not found" });

        res.status(200).json({ message: "Review updated", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ❌ Delete a review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await reviewsAndRatingModel.findByIdAndDelete(id);

        if (!review) return res.status(404).json({ message: "Review not found" });

        res.status(200).json({ message: "Review deleted", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📖 Get all reviews for a target (vet/product/shelter)
const getReviewsForTarget = async (req, res) => {
    try {
        const { targetId, targetType } = req.query;

        if (!targetId || !targetType) {
            return res.status(400).json({ message: "targetId and targetType are required" });
        }

        const reviews = await reviewsAndRatingModel.find({ targetId, targetType }).populate("userId", "name email");

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📊 Get average rating for a target
const getAverageRating = async (req, res) => {
    try {
        const { targetId, targetType } = req.query;

        const result = await reviewsAndRatingModel.aggregate([
            { $match: { targetId: new mongoose.Types.ObjectId(targetId), targetType } },
            { $group: { _id: "$targetId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);

        if (result.length === 0) {
            return res.status(200).json({ avgRating: 0, count: 0 });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getReviewsForTarget,
    getAverageRating
};
