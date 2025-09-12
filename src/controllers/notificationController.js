const notificationModel = require("../models/notificationSchema.js");

// 📩 Create a notification
const createNotification = async (req, res) => {
    try {
        const { userId, vetId, shelterId, message, type } = req.body;

        if (!message || !type) {
            return res.status(400).json({ message: "Message and type are required" });
        }

        const notification = await notificationModel.create({
            userId,
            vetId,
            shelterId,
            message,
            type,
        });

        res.status(201).json({ message: "Notification created", notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📖 Get notifications (by user/vet/shelter)
const getNotifications = async (req, res) => {
    try {
        const { userId, vetId, shelterId } = req.query;

        let filter = {};
        if (userId) filter.userId = userId;
        if (vetId) filter.vetId = vetId;
        if (shelterId) filter.shelterId = shelterId;

        const notifications = await notificationModel.find(filter).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Mark a single notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationModel.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Mark all notifications as read for a user/vet/shelter
const markAllAsRead = async (req, res) => {
    try {
        const { userId, vetId, shelterId } = req.query;

        let filter = {};
        if (userId) filter.userId = userId;
        if (vetId) filter.vetId = vetId;
        if (shelterId) filter.shelterId = shelterId;

        const result = await notificationModel.updateMany(filter, { read: true });

        res.status(200).json({ message: "All notifications marked as read", result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ❌ Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationModel.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted", notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
