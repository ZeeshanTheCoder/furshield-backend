const express = require("express");
const {
  createVet,
  getAllVets,
  getVetById,
  updateVet,
  deleteVet,
  allvetfetch,
} = require("../controllers/vetController.js");
const verifyToken = require("../Middlwares/verifytokenMiddleware.js");

const router = express.Router();

router.post("/createvet", verifyToken, createVet); // Create vet profile
router.get("/", getAllVets); // Get all vets
router.get("/getvetbyId", verifyToken, getVetById); // Get single vet
router.put("/:id", updateVet); // Update vet
router.delete("/:id", deleteVet); // Delete vet

router.get("/allvet", verifyToken, allvetfetch);

module.exports = router;
