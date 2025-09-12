// controllers/healthRecordController.js
const healthRecordModel = require("../models/healthRecordSchema.js");
const imagekit = require("../Utils/imagekit.utils");

const createHealthRecord = async (req, res) => {
  try {
    const { petId, vaccinations, allergies, illnesses, treatments, insurance } =
      req.body;

    if (!petId) {
      return res.status(400).json({ message: "Pet ID is required" });
    }

    // ✅ Parse JSON strings back to arrays/objects
    let parsedVaccinations = [];
    if (vaccinations) {
      try {
        parsedVaccinations = JSON.parse(vaccinations);
      } catch (e) {
        console.error("Invalid vaccinations JSON:", vaccinations);
        return res.status(400).json({ message: "Invalid vaccinations format" });
      }
    }

    let parsedAllergies = [];
    if (allergies) {
      try {
        parsedAllergies = JSON.parse(allergies);
      } catch (e) {
        console.error("Invalid allergies JSON:", allergies);
        return res.status(400).json({ message: "Invalid allergies format" });
      }
    }

    let parsedIllnesses = [];
    if (illnesses) {
      try {
        parsedIllnesses = JSON.parse(illnesses);
      } catch (e) {
        console.error("Invalid illnesses JSON:", illnesses);
        return res.status(400).json({ message: "Invalid illnesses format" });
      }
    }

    let parsedTreatments = [];
    if (treatments) {
      try {
        parsedTreatments = JSON.parse(treatments);
      } catch (e) {
        console.error("Invalid treatments JSON:", treatments);
        return res.status(400).json({ message: "Invalid treatments format" });
      }
    }

     let insuranceData = {};
    if (insurance) {
      insuranceData = {
        provider: insurance, // Store string in provider
        policyNo: "",
        docs: []
      };
    }

    // ✅ Handle uploaded files
    let documentUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploaded = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/health-records",
          });
          documentUrls.push(uploaded.url); // ✅ Save string URL, not object
        } catch (uploadError) {
          console.error("ImageKit Upload Error:", uploadError.message);
          return res.status(500).json({ message: "File upload failed" });
        }
      }
    }

    const newRecord = await healthRecordModel.create({
      petId,
      vaccinations: parsedVaccinations,
      allergies: parsedAllergies,
      illnesses: parsedIllnesses,
      treatments: parsedTreatments,
      documents: documentUrls, // ✅ Match schema: [String]
      insurance: insuranceData,
    });

    return res.status(201).json({
      message: "Health record created successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error("Create Health Record Error:", error.message);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ✅ Update Health Record
const updateHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body }; // 👈 Create a copy to modify

    // ✅ Parse JSON fields just like in createHealthRecord
    if (updates.vaccinations) {
      try {
        updates.vaccinations = JSON.parse(updates.vaccinations);
      } catch (e) {
        return res.status(400).json({ message: "Invalid vaccinations format" });
      }
    }

    if (updates.allergies) {
      try {
        updates.allergies = JSON.parse(updates.allergies);
      } catch (e) {
        return res.status(400).json({ message: "Invalid allergies format" });
      }
    }

    if (updates.illnesses) {
      try {
        updates.illnesses = JSON.parse(updates.illnesses);
      } catch (e) {
        return res.status(400).json({ message: "Invalid illnesses format" });
      }
    }

    if (updates.treatments) {
      try {
        updates.treatments = JSON.parse(updates.treatments);
      } catch (e) {
        return res.status(400).json({ message: "Invalid treatments format" });
      }
    }

    // ✅ Handle uploaded files for update
    if (req.files && req.files.length > 0) {
      let documentUrls = [];
      for (const file of req.files) {
        try {
          const uploaded = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/health-records",
          });
          documentUrls.push(uploaded.url);
        } catch (uploadError) {
          console.error("ImageKit Upload Error:", uploadError.message);
          return res.status(500).json({ message: "File upload failed" });
        }
      }
      updates.documents = documentUrls; // ✅ Replace documents
    }

    // ✅ Handle insurance
    if (updates.insurance) {
      updates.insurance = {
        provider: updates.insurance,
        policyNo: "",
        docs: []
      };
    }

    const updatedRecord = await healthRecordModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    return res.status(200).json({
      message: "Health record updated successfully",
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Update Health Record Error:", error.message);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ✅ View All Health Records for a Pet
// ✅ View All Health Records for a Pet
const getHealthRecordsByPet = async (req, res) => {
  try {
    const { petId } = req.params; // ✅ This was missing!
    console.log(
      "✅ getHealthRecordsByPet called with petId:",
      req.params.petId
    );

    const records = await healthRecordModel.find({ petId }).populate("petId");

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No health records found for this pet" });
    }

    return res.status(200).json({ records });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ View Single Health Record
const getHealthRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("❌ getHealthRecordById called with id:", id);

    const record = await healthRecordModel.findById(id).populate("petId");

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    return res.status(200).json({ record });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHealthRecord,
  updateHealthRecord,
  getHealthRecordsByPet,
  getHealthRecordById,
};
