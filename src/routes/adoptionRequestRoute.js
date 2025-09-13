const express = require("express");
const {
  createAdoptionRequest,
  updateAdoptionStatus,
  getShelterRequests,
} = require("../controllers/adoptionRequestController");
const verifytoken = require("../Middlwares/verifytokenMiddleware");

const router = express.Router();

// POST - Create adoption request
router.post("/createadoptionrequest", verifytoken, createAdoptionRequest);

// PUT - Update adoption request status (approve/reject)
router.put("/updateadoptionrequest/:requestId", verifytoken, updateAdoptionStatus);

// GET - Shelter Dashboard (all requests for this shelter)
router.get("/shelter/requests", verifytoken, getShelterRequests);

module.exports = router;