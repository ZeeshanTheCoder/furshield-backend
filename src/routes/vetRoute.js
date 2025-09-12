const express = require("express");
const {
    createVet,
    getAllVets,
    getVetById,
    updateVet,
    deleteVet
} = require("../controllers/vetController.js");

const router = express.Router();

router.post("/", createVet);          // Create vet profile
router.get("/", getAllVets);          // Get all vets
router.get("/:id", getVetById);       // Get single vet
router.put("/:id", updateVet);        // Update vet
router.delete("/:id", deleteVet);     // Delete vet

module.exports = router;
