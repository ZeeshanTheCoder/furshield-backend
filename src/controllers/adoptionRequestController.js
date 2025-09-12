const adoptionRequestModel = require("../models/adoptionRequestSchema.js");
const mongoose = require("mongoose");

// ✅ Create Adoption Request
const createAdoptionRequest = async (req, res) => {
    try {
        const { petId, userId, shelterId, message } = req.body;

        if (!petId || !userId || !shelterId) {
            return res.status(400).json({ message: "petId, userId, and shelterId are required" });
        }

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(petId) ||
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(shelterId)
        ) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const request = await adoptionRequestModel.create({
            petId,
            userId,
            shelterId,
            message
        });

        return res.status(201).json({ message: "Adoption request submitted", request });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get All Requests (admin/shelter)
const getAllAdoptionRequests = async (req, res) => {
    try {
        const requests = await adoptionRequestModel.find()
            .populate("petId", "name breed age")
            .populate("userId", "name email")
            .populate("shelterId", "name address");

        return res.status(200).json(requests);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get Requests for a Shelter
const getShelterRequests = async (req, res) => {
    try {
        const { shelterId } = req.params;

        const requests = await adoptionRequestModel.find({ shelterId })
            .populate("petId", "name breed age")
            .populate("userId", "name email");

        return res.status(200).json(requests);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Update Request Status (approve/reject)
const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const request = await adoptionRequestModel.findByIdAndUpdate(
            requestId,
            { status, respondedAt: Date.now() },
            { new: true }
        )
            .populate("petId", "name breed age")
            .populate("userId", "name email");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        return res.status(200).json({ message: `Request ${status}`, request });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Delete Request
const deleteAdoptionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const result = await adoptionRequestModel.findByIdAndDelete(requestId);

        if (!result) {
            return res.status(404).json({ message: "Request not found" });
        }

        return res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAdoptionRequest,
    getAllAdoptionRequests,
    getShelterRequests,
    updateRequestStatus,
    deleteAdoptionRequest
};
