// routes/healthRecordRoutes.js
const express = require("express");
const verifyToken = require("../Middlwares/verifytokenMiddleware");
const {
  createHealthRecord,
  updateHealthRecord,
  getHealthRecordById,
  getHealthRecordsByPet,
  downloadHealthRecord,
} = require("../controllers/healthRecordController");
const upload = require("../Middlwares/Upload");
const healthrecordRouter = express.Router();

// Create new health record (protected)
healthrecordRouter.post(
  "/createhealthrecord",
  verifyToken,
  upload.array("gallery", 4),
  createHealthRecord
);

// Update existing health record (protected)
healthrecordRouter.put(
  "/updatehealthrecord/:id",
  verifyToken,
  upload.array("gallery", 4),
  updateHealthRecord
);

// Get all health records for a pet
healthrecordRouter.get("/getrecord/:id", verifyToken, getHealthRecordById);

healthrecordRouter.get(
  "/gethealthrecord/:petId",
  verifyToken,
  getHealthRecordsByPet
);

// Download health record pdf file
healthrecordRouter.get("/download/:recordId", verifyToken, downloadHealthRecord);

module.exports = healthrecordRouter;
