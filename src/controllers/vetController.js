const vetModel = require("../models/vetSchema.js");
const userModel = require("../models/userSchema.js");

// Create Vet Profile
const createVet = async (req, res) => {
  try {
    const vetId = req.user.id;
    const { specialization, experience, availableSlots } = req.body;

    // check if user exists and has role "vet"
    const user = await userModel.findById(vetId);
    if (!user || user.role !== "vet") {
      return res.status(400).json({ message: "Invalid user or user is not a vet" });
    }

    // Check if vet profile already exists
    let vet = await vetModel.findOne({ userId: vetId });

    if (vet) {
      // Update existing vet profile
      vet.specialization = specialization || vet.specialization;
      vet.experience = experience || vet.experience;
      vet.availableSlots = availableSlots || vet.availableSlots;
      await vet.save();

      return res.status(200).json({ message: "Vet profile updated successfully", vet });
    } else {
      // Create new vet profile
      vet = await vetModel.create({
        userId: vetId,
        specialization,
        experience,
        availableSlots,
      });

      return res.status(201).json({ message: "Vet profile created successfully", vet });
    }
  } catch (error) {
    console.error(error);
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
        const id = req.user.id
        const vet = await vetModel.findById(id)
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

const allvetfetch = async (req, res) => {
  try {
    const response = await userModel.find({ role: "vet" }).lean();

    // har vet user ke liye uska vet details lao
    const vetsWithDetails = await Promise.all(
      response.map(async (user) => {
        const vetData = await vetModel.findOne({ userId: user._id }).lean();
        return {
          ...user,
          ...vetData, // merge vet ke fields
        };
      })
    );

    return res.status(200).json(vetsWithDetails);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const bookiappointment = async(req,res)=>{

}


module.exports = {
    allvetfetch,
    createVet,
    getAllVets,
    getVetById,
    updateVet,
    deleteVet,
    bookiappointment
};