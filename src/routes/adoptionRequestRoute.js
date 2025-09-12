const express = require("express");
const {
    createAdoptionRequest,
    getAllAdoptionRequests,
    getShelterRequests,
    updateRequestStatus,
    deleteAdoptionRequest
} = require("../controllers/adoptionRequestController.js");

const router = express.Router();

// POST - Create adoption request
router.post("/", createAdoptionRequest);

// GET - All adoption requests
router.get("/", getAllAdoptionRequests);

// GET - Requests for specific shelter
router.get("/shelter/:shelterId", getShelterRequests);

// PUT - Update adoption request status (approve/reject)
router.put("/:requestId", updateRequestStatus);

// DELETE - Delete adoption request
router.delete("/:requestId", deleteAdoptionRequest);

module.exports = router;
