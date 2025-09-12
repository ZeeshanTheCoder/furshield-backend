const careContentModel = require("../models/careContentSchema.js");

// ✅ Create Care Content
const createCareContent = async (req, res) => {
    try {
        const { title, type, category, content, videoUrl } = req.body;

        if (!title || !type || !category || !content) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const newContent = await careContentModel.create({
            title,
            type,
            category,
            content,
            videoUrl
        });

        return res.status(201).json({
            message: "Care content created successfully",
            content: newContent
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get All Care Content
const getAllCareContent = async (req, res) => {
    try {
        const contents = await careContentModel.find();
        return res.status(200).json(contents);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get Content by Category
const getContentByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const contents = await careContentModel.find({ category });

        return res.status(200).json(contents);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Get Content by Type (article, video, faq)
const getContentByType = async (req, res) => {
    try {
        const { type } = req.params;
        const contents = await careContentModel.find({ type });

        return res.status(200).json(contents);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Update Care Content
const updateCareContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const updates = req.body;

        const updatedContent = await careContentModel.findByIdAndUpdate(
            contentId,
            updates,
            { new: true }
        );

        if (!updatedContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        return res.status(200).json({
            message: "Content updated successfully",
            content: updatedContent
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

// ✅ Delete Care Content
const deleteCareContent = async (req, res) => {
    try {
        const { contentId } = req.params;

        const deletedContent = await careContentModel.findByIdAndDelete(contentId);

        if (!deletedContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        return res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCareContent,
    getAllCareContent,
    getContentByCategory,
    getContentByType,
    updateCareContent,
    deleteCareContent
};
