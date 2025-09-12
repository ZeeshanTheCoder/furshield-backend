const express = require("express");
const {
    createCareContent,
    getAllCareContent,
    getContentByCategory,
    getContentByType,
    updateCareContent,
    deleteCareContent
} = require("../controllers/careContentController.js");

const router = express.Router();

// POST - Add new care content
router.post("/", createCareContent);

// GET - All care content
router.get("/", getAllCareContent);

// GET - Filter by category (feeding, hygiene, etc.)
router.get("/category/:category", getContentByCategory);

// GET - Filter by type (article, video, faq)
router.get("/type/:type", getContentByType);

// PUT - Update content
router.put("/:contentId", updateCareContent);

// DELETE - Remove content
router.delete("/:contentId", deleteCareContent);

module.exports = router;
