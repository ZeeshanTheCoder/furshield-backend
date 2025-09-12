const treatmentLogModel = require("../models/treatmentSchema.js");

const createTreatmentLog = async (req, res) => {
    try {
        const { appointmentId, vetId, petId, symptoms, diagnosis, prescription, followUpDate, labResults } = req.body;

        if (!appointmentId || !vetId || !petId || !diagnosis) {
            return res.status(400).json({ message: "appointmentId, vetId, petId and diagnosis are required" });
        }

        const log = await treatmentLogModel.create({
            appointmentId,
            vetId,
            petId,
            symptoms,
            diagnosis,
            prescription,
            followUpDate,
            labResults
        });

        res.status(201).json({ message: "Treatment log created successfully", log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTreatmentLog = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLog = await treatmentLogModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedLog) {
            return res.status(404).json({ message: "Treatment log not found" });
        }

        res.status(200).json({ message: "Treatment log updated successfully", updatedLog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTreatmentLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLog = await treatmentLogModel.findByIdAndDelete(id);

        if (!deletedLog) {
            return res.status(404).json({ message: "Treatment log not found" });
        }

        res.status(200).json({ message: "Treatment log deleted successfully", deletedLog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLogsByPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const logs = await treatmentLogModel.find({ petId }).populate("vetId", "name email").populate("appointmentId");

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLogsByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const logs = await treatmentLogModel.find({ appointmentId }).populate("vetId", "name email");

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTreatmentLog,
    updateTreatmentLog,
    deleteTreatmentLog,
    getLogsByPet,
    getLogsByAppointment
};
