const express = require("express");
const router = express.Router();
const {
    createTreatmentLog,
    updateTreatmentLog,
    deleteTreatmentLog,
    getLogsByPet,
    getLogsByAppointment
} = require("../controllers/treatmentLogController.js");

// Create treatment log
router.post("/", createTreatmentLog);

// Update treatment log
router.put("/:id", updateTreatmentLog);

// Delete treatment log
router.delete("/:id", deleteTreatmentLog);

// Get logs for a specific pet
router.get("/pet/:petId", getLogsByPet);

// Get logs for a specific appointment
router.get("/appointment/:appointmentId", getLogsByAppointment);

module.exports = router;
