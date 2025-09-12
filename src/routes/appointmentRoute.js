const express = require("express");
const {
  createAppointment,
  getAllAppointments,
  getAppointmentsByOwner,
  getAppointmentsByVet,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController.js");
const verifyToken = require("../Middlwares/verifytokenMiddleware.js");

const router = express.Router();

// POST - Create appointment
router.post("/", verifyToken, createAppointment);

// GET - All appointments
router.get("/", getAllAppointments);

// GET - Appointments by owner
router.get("/owner", verifyToken, getAppointmentsByOwner);

// GET - Appointments by vet
router.get("/vet/:vetId", getAppointmentsByVet);

// PUT - Update appointment details
router.put("/:appointmentId", updateAppointment);

// PATCH - Update only status
router.patch("/:appointmentId/status", updateAppointmentStatus);

// DELETE - Delete appointment
router.delete("/:appointmentId", deleteAppointment);

module.exports = router;
