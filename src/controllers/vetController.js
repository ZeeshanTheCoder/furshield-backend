const vetModel = require("../models/vetSchema.js");
const userModel = require("../models/userSchema.js");

// Create Vet Profile
const createVet = async (req, res) => {
    try {
        const { userId, specialization, experience, availableSlots } = req.body;

        // check if user exists and has role "vet"
        const user = await userModel.findById(userId);
        if (!user || user.role !== "vet") {
            return res.status(400).json({ message: "Invalid user or user is not a vet" });
        }

        // prevent duplicate vet profile
        const existingVet = await vetModel.findOne({ userId });
        if (existingVet) {
            return res.status(400).json({ message: "Vet profile already exists for this user" });
        }

        const vet = await vetModel.create({
            userId,
            specialization,
            experience,
            availableSlots
        });

        return res.status(201).json({ message: "Vet profile created successfully", vet });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get All Vets
const getAllVets = async (req, res) => {
    try {
        const vets = await vetModel.find()
            .populate("userId", "name email contactNumber address role");

        return res.status(200).json(vets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Single Vet by ID
const getVetById = async (req, res) => {
    try {
        const vet = await vetModel.findById(req.params.id)
            .populate("userId", "name email contactNumber address role");

        if (!vet) return res.status(404).json({ message: "Vet not found" });

        return res.status(200).json(vet);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Vet Profile
const updateVet = async (req, res) => {
    try {
        const vet = await vetModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("userId", "name email contactNumber address role");

        if (!vet) return res.status(404).json({ message: "Vet not found" });

        return res.status(200).json({ message: "Vet profile updated", vet });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete Vet Profile
const deleteVet = async (req, res) => {
    try {
        const vet = await vetModel.findByIdAndDelete(req.params.id);

        if (!vet) return res.status(404).json({ message: "Vet not found" });

        return res.status(200).json({ message: "Vet profile deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVet,
    getAllVets,
    getVetById,
    updateVet,
    deleteVet
};
