const mongoose = require("mongoose");
const adoptionRequestModel = require("../models/adoptionRequestSchema");
const adoptablePetModel = require("../models/adoptablePetSchema");
const sendEmail = require("../Utils/sendEmail");

// ✅ Create Adoption Request
const createAdoptionRequest = async (req, res) => {
    try {
        const userId = req.user.id; // from verifytoken
        const { petId, message } = req.body;

        if (!petId || !userId) {
            return res.status(400).json({ message: "petId and userId are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({ message: "Invalid petId format" });
        }

        // ✅ get shelterId from pet
        const pet = await adoptablePetModel.findById(petId).populate("shelterId");
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const request = await adoptionRequestModel.create({
            petId,
            userId,
            shelterId: pet.shelterId._id,
            message,
        });

        // ✅ Populate full request
        const populatedRequest = await adoptionRequestModel.findById(request._id)
            .populate("petId", "name")
            .populate("userId", "name email")
            .populate("shelterId", "name email");

        // ✅ Notify Shelter via Email
        const emailBody = `
      <h3>New Adoption Request</h3>
      <p><strong>Pet:</strong> ${populatedRequest.petId.name}</p>
      <p><strong>Requester:</strong> ${populatedRequest.userId.name} (${populatedRequest.userId.email})</p>
      <p><strong>Message:</strong> ${populatedRequest.message}</p>
    `;

        await sendEmail(populatedRequest.shelterId.email, "New Adoption Request", emailBody);

        return res
            .status(201)
            .json({ message: "Adoption request submitted & email sent", request });
    } catch (error) {
        console.error("Error in createAdoptionRequest:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Shelter updates status & notify user
const updateAdoptionStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // pending | approved | rejected

        const request = await adoptionRequestModel
            .findByIdAndUpdate(requestId, { status }, { new: true })
            .populate("userId", "name email")
            .populate("petId", "name");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // ✅ Email notify user
        const emailBody = `
      <h3>Adoption Request Update</h3>
      <p>Your request for <strong>${request.petId.name}</strong> has been <b>${status}</b>.</p>
    `;
        await sendEmail(request.userId.email, "Adoption Request Update", emailBody);

        return res
            .status(200)
            .json({ message: "Status updated & email sent", request });
    } catch (error) {
        console.error("Error in updateAdoptionStatus:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

// GET - All Adoption Requests for a Shelter
const getShelterRequests = async (req, res) => {
    try {
        const shelterId = req.user.id; // ✅ shelter ka ID verifytoken se aayega
        // check role
        if (req.user.role !== "shelter") {
            return res.status(403).json({ message: "Only shelters can view requests" });
        }

        // get adoption requests for this shelter
        const requests = await adoptionRequestModel
            .find({ shelterId })
            .populate("petId", "name age breed")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests,
        });
    } catch (error) {
        console.error("Error in getShelterRequests:", error.message);
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createAdoptionRequest,
    updateAdoptionStatus,
    getShelterRequests
};