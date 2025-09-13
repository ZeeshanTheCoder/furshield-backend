const appointmentModel = require("../models/appointmentSchema.js");
const mongoose = require("mongoose");
const vetModel = require("../models/vetSchema.js");

// ✅ Create Appointment
const createAppointment = async (req, res) => {
  try {
    const { petId, vetId, date, time, reason, notes } = req.body;

    if (!petId || !date || !time || !reason) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // OwnerId always comes from token
    const ownerId = req.user.id;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(petId) ||
      !mongoose.Types.ObjectId.isValid(ownerId) ||
      !mongoose.Types.ObjectId.isValid(vetId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const appointment = await appointmentModel.create({
      petId,
      ownerId, // 👈 always from token
      vetId,
      date,
      time,
      reason,
      notes,
    });

    return res.status(201).json({
      success: true, // 👈 ye zaroor bhejna
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find()
      .populate("petId", "name species breed")
      .populate("ownerId", "name email")
      .populate("vetId", "name email specialization");

    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get Appointments by Owner
const getAppointmentsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const appointments = await appointmentModel
      .find({ ownerId })
      .populate("petId", "name species breed")
      .populate({
        path: "vetId",
        select: "specialization",
        populate: {
          path: "userId",
          select: "name email specialization",
        },
      });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get Appointments by Vet
const getAppointmentsByVet = async (req, res) => {
  try {
    const vetId = req.user.id;

    const vet = await vetModel.findOne({ userId: req.user.id });

    if (!vet) {
      return res.status(404).json({ message: "Vet profile not found" });
    }
    const appointments = await appointmentModel
      .find({ vetId: vet._id })
      .populate("petId", "name species breed")
      .populate("ownerId", "name email")
      .populate({
        path: "vetId",
        populate: {
          path: "userId",
          select: "name email",
        },
        select: "specialization userId",
      });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update Appointment (reschedule, add notes, etc.)
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updates = req.body;

    const appointment = await appointmentModel
      .findByIdAndUpdate(appointmentId, updates, { new: true })
      .populate("petId", "name species breed")
      .populate("ownerId", "name email")
      .populate("vetId", "name email specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ message: "Appointment updated", appointment });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update Appointment Status
// PATCH /appointment/:appointmentId/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Allowed statuses for Vet
    const allowedStatuses = [
      "pending",
      "approved",
      "rescheduled",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Vet check (optional but recommended 👇)
    if (req.user.role !== "vet") {
      return res
        .status(403)
        .json({ message: "Only vets can update appointment status" });
    }

    // Get vet profile
    const vet = await vetModel.findOne({ userId: req.user.id });
    if (!vet) {
      return res.status(404).json({ message: "Vet profile not found" });
    }

    // Find appointment only for this vet
    const appointment = await appointmentModel.findOneAndUpdate(
      { _id: appointmentId, vetId: vet._id }, // ensure this vet owns it
      { status },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found or not assigned to this vet" });
    }

    return res.status(200).json({
      message: `Appointment status updated to ${status}`,
      appointment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("petId", "name species breed")
      .populate("ownerId", "name email")
      .populate("vetId", "name email specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const result = await appointmentModel.findByIdAndDelete(appointmentId);

    if (!result) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByOwner,
  getAppointmentsByVet,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentById,
};
