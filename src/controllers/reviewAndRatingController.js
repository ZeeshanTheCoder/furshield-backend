const reviewsAndRatingModel = require("../models/reviewsAndRatingSchema.js");
const mongoose = require("mongoose");

// ⭐ Create a review/rating
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!userId || !rating) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Check if user already rated this target
    const existingReview = await reviewsAndRatingModel.findOne({
      userId,
      productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await reviewsAndRatingModel.create({
      userId,
      rating,
      comment,
      productId,
    });

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProductReviews = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const reviews = await reviewsAndRatingModel
      .find({ productId })
      .populate("userId", "name email");

    res.status(200).json({ count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET: User ka apna review ek product ke liye
const getUserProductReview = async (req, res) => {
  try {
    const userId = req.user.id; // verifytoken se
    const { productId } = req.query; // query param

    if (!productId) {
      return res.status(400).json({ message: "productId required he" });
    }

    const review = await reviewsAndRatingModel
      .findOne({ userId, productId })
      .populate("userId", "name email"); // user ka data bhi le lo

    if (!review) {
      return res.status(200).json({ reviews: [] }); // empty array bhej do
    }

    // ek review milega, array ke form me bhej rahe hain
    res.status(200).json({ reviews: [review] });
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
      return res
        .status(400)
        .json({ message: "targetId and targetType are required" });
    }

    const reviews = await reviewsAndRatingModel
      .find({ targetId, targetType })
      .populate("userId", "name email");

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
      {
        $match: { targetId: new mongoose.Types.ObjectId(targetId), targetType },
      },
      {
        $group: {
          _id: "$targetId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
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
  getAllProductReviews,
  updateReview,
  deleteReview,
  getReviewsForTarget,
  getAverageRating,
  getUserProductReview,
};
