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

// Create adoptable pet
router.post("/", createAdoptablePet);

// Get all adoptable pets (with filters)
router.get("/", getAdoptablePets);

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
