const appointmentModel = require("../models/appointmentSchema.js");
const mongoose = require("mongoose");

// ✅ Create Appointment
const createAppointment = async (req, res) => {
    try {
        const { petId, ownerId, vetId, date, time, reason, notes } = req.body;

        if (!petId || !ownerId || !vetId || !date || !time || !reason) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        if (
            !mongoose.Types.ObjectId.isValid(petId) ||
            !mongoose.Types.ObjectId.isValid(ownerId) ||
            !mongoose.Types.ObjectId.isValid(vetId)
        ) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const appointment = await appointmentModel.create({
            petId,
            ownerId,
            vetId,
            date,
            time,
            reason,
            notes
        });

        return res.status(201).json({ message: "Appointment created successfully", appointment });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get All Appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find()
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
        const { ownerId } = req.params;
        const appointments = await appointmentModel.find({ ownerId })
            .populate("petId", "name species breed")
            .populate("vetId", "name email specialization");

        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get Appointments by Vet
const getAppointmentsByVet = async (req, res) => {
    try {
        const { vetId } = req.params;
        const appointments = await appointmentModel.find({ vetId })
            .populate("petId", "name species breed")
            .populate("ownerId", "name email");

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

        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            updates,
            { new: true }
        )
            .populate("petId", "name species breed")
            .populate("ownerId", "name email")
            .populate("vetId", "name email specialization");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ message: "Appointment updated", appointment });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        if (!["pending", "approved", "rescheduled", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ message: `Appointment status updated to ${status}`, appointment });
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

        return res.status(200).json({ message: "Appointment deleted successfully" });
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
    deleteAppointment
};
