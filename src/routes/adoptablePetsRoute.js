// routes/adoptablePetRoutes.js
const express = require("express");
const router = express.Router();
const {
    createAdoptablePet,
    getAdoptablePets,
    getAdoptablePetById,
    updateAdoptablePet,
    deleteAdoptablePet,
    addCareLog,
    updateAdoptionStatus
} = require("../controllers/adoptablePetsController.js");
const verifyToken = require("../Middlwares/verifytokenMiddleware.js");
const upload = require("../Middlwares/Upload.js");

// Create adoptable pet
router.post("/createadoptable", verifyToken, upload.single("image"), createAdoptablePet);

// Get all adoptable pets (with filters)
router.get("/getadoptable", getAdoptablePets);

// Get single adoptable pet
router.get("/:id", getAdoptablePetById);

// Update adoptable pet
router.put("/:id", updateAdoptablePet);

// Delete adoptable pet
router.delete("/:id", deleteAdoptablePet);

// Add care log to a pet
router.post("/:id/carelog", addCareLog);

// Update adoption status
router.patch("/:id/adoption", updateAdoptionStatus);

module.exports = router;