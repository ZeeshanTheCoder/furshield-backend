const petModel = require("../models/petSchema");
const imagekit = require("../Utils/imagekit.utils");

const petscreate = async (req, res) => {
  try {
    const { name, species, breed, age, medicalHistory, ownerId } = req.body;

    // 1. Validate required fields
    if (!name || !species || !breed || !age || !ownerId) {
      return res.status(400).json({
        message: "Name, species, breed, age, and ownerId are required",
        isSaved: false,
      });
    }

    let galleryUrls = [];

    // 2. Agar files aayi hain to ImageKit pe upload karo
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await imagekit.upload({
          file: file.buffer, // multer se file buffer
          fileName: file.originalname,
          folder: "/pets", // optional: pets folder in ImageKit
        });
        galleryUrls.push(uploaded.url);
      }
    }

    // 3. Create new pet
    const newPet = await petModel.create({
      name,
      species,
      breed,
      age,
      medicalHistory: medicalHistory ? JSON.parse(medicalHistory) : [], // agar frontend array bheje
      gallery: galleryUrls,
      ownerId,
    });

    // 4. Success response
    return res.status(201).json({
      message: "Pet created successfully",
      isSaved: true,
      pet: newPet,
    });
  } catch (error) {
    console.error("Pet Create Error:", error.message);
    return res.status(500).json({
      message: error.message,
      isSaved: false,
    });
  }
};

const updatePet = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Get fields from req.body (now parsed by multer)
    let { name, species, breed, age, medicalHistory } = req.body;

    // ✅ Parse medicalHistory if it's a JSON string (sent from frontend)
    if (medicalHistory) {
      try {
        medicalHistory = JSON.parse(medicalHistory);
      } catch (e) {
        return res.status(400).json({
          message: "Invalid medicalHistory format. Expected JSON string.",
          isUpdated: false,
        });
      }
    }

    // ✅ Handle new gallery uploads
    let galleryUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/pets",
        });
        galleryUrls.push(uploaded.url);
      }
    }

    // ✅ Build update object
    const updateData = {
      name,
      species,
      breed,
      age,
      medicalHistory,
    };

    // ✅ Only update gallery if new images uploaded
    if (galleryUrls.length > 0) {
      updateData.gallery = galleryUrls;
    }

    // ✅ Find and update pet
    const updatedPet = await petModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({
        message: "Pet not found",
        isUpdated: false,
      });
    }

    return res.status(200).json({
      message: "Pet updated successfully",
      isUpdated: true,
      pet: updatedPet,
    });
  } catch (error) {
    console.error("Update Pet Error:", error.message);
    return res.status(500).json({
      message: "Server error: " + error.message,
      isUpdated: false,
    });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPet = await petModel.findByIdAndDelete(id);

    if (!deletedPet) {
      return res.status(404).json({
        message: "Pet not found",
        isDeleted: false,
      });
    }

    return res.status(200).json({
      message: "Pet deleted successfully",
      isDeleted: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message,
      isDeleted: false,
    });
  }
};

const getPetsByOwner = async (req, res) => {
  try {
    const id = req.user.id;

    const pets = await petModel.find({ ownerId: id });
    if (!pets || pets.length === 0) {
      return res.status(404).json({
        message: "No pets found for this owner",
      });
    }

    return res.status(200).json({
      message: "Pets fetched successfully",
    count: pets.length,
      pets,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const petsfetchbyid = async (req, res) => {
  try {
    const pet = await petModel.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    // Ensure user owns this pet
    if (pet.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json({ pet });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  petscreate,
  updatePet,
  deletePet,
  getPetsByOwner,
  petsfetchbyid,
};
