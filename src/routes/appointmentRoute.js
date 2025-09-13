const express = require("express");
const {
  createAppointment,
  getAllAppointments,
  getAppointmentsByOwner,
  getAppointmentsByVet,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentById,
} = require("../controllers/appointmentController.js");
const verifyToken = require("../Middlwares/verifytokenMiddleware.js");

const router = express.Router();

// POST - Create appointment
router.post("/", verifyToken, createAppointment);

// GET - All appointments
router.get("/", getAllAppointments);

// GET - Appointments by owner
router.get("/owner", verifyToken, getAppointmentsByOwner);

// GET - Single appointment by ID
router.get("/vet/:appointmentId", verifyToken, getAppointmentById);

// GET - Appointments by vet
router.get("/user_vet", verifyToken, getAppointmentsByVet);

// PUT - Update appointment details
router.put("/vet/:appointmentId", updateAppointment);

// PATCH - Update only status
router.patch("/vet/:appointmentId/status", verifyToken, updateAppointmentStatus);

// DELETE - Delete appointment
router.delete("/vet/:appointmentId", deleteAppointment);

module.exports = router;
