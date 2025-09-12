// controllers/adoptablePetController.js
const adoptablePetModel = require("../models/adoptablePetSchema.js");

// ✅ Create an adoptable pet
const createAdoptablePet = async (req, res) => {
    try {
        const { name, breed, age, healthStatus, images, shelterId } = req.body;

        if (!name || !breed || !age || !healthStatus || !shelterId) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const pet = await adoptablePetModel.create({
            name,
            breed,
            age,
            healthStatus,
            images,
            shelterId
        });

        return res.status(201).json({ message: "Adoptable pet added successfully", pet });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get all adoptable pets (with filters)
const getAdoptablePets = async (req, res) => {
    try {
        const { breed, isAdopted } = req.query;
        let filter = {};

        if (breed) filter.breed = breed;
        if (isAdopted !== undefined) filter.isAdopted = isAdopted === "true";

        const pets = await adoptablePetModel.find(filter).populate("shelterId");

        return res.status(200).json({ count: pets.length, pets });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get single adoptable pet
const getAdoptablePetById = async (req, res) => {
    try {
        const { id } = req.params;

        const pet = await adoptablePetModel.findById(id).populate("shelterId");

        if (!pet) {
            return res.status(404).json({ message: "Adoptable pet not found" });
        }

        return res.status(200).json({ pet });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Update adoptable pet info
const updateAdoptablePet = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedPet = await adoptablePetModel.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!updatedPet) {
            return res.status(404).json({ message: "Adoptable pet not found" });
        }

        return res.status(200).json({ message: "Pet updated successfully", pet: updatedPet });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Delete adoptable pet
const deleteAdoptablePet = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPet = await adoptablePetModel.findByIdAndDelete(id);

        if (!deletedPet) {
            return res.status(404).json({ message: "Adoptable pet not found" });
        }

        return res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Add care log (feeding, grooming, medical)
const addCareLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity, notes } = req.body;

        if (!activity) {
            return res.status(400).json({ message: "Activity type is required" });
        }

        const pet = await adoptablePetModel.findById(id);

        if (!pet) {
            return res.status(404).json({ message: "Adoptable pet not found" });
        }

        pet.careLogs.push({ activity, notes });
        await pet.save();

        return res.status(200).json({ message: "Care log added successfully", pet });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Update adoption status
const updateAdoptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAdopted } = req.body;

        const pet = await adoptablePetModel.findByIdAndUpdate(
            id,
            { isAdopted },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ message: "Adoptable pet not found" });
        }

        return res.status(200).json({ message: "Adoption status updated", pet });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAdoptablePet,
    getAdoptablePets,
    getAdoptablePetById,
    updateAdoptablePet,
    deleteAdoptablePet,
    addCareLog,
    updateAdoptionStatus
};
