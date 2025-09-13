const express = require("express");
const router = express.Router();
const {
    createReview,
    updateReview,
    deleteReview,
    getReviewsForTarget,
    getAverageRating,
    getUserProductReview
} = require("../controllers/reviewAndRatingController.js");

const verifytoken = require('../Middlwares/verifytokenMiddleware.js')

// Create review
router.post("/createreview", verifytoken, createReview);

router.get("/productreview", verifytoken, getUserProductReview);


// Update review

router.put("/:id", updateReview);

// Delete review
router.delete("/:id", deleteReview);

// Get reviews for a target
router.get("/", getReviewsForTarget);

// Get average rating for a target
router.get("/average", getAverageRating);

module.exports = router;