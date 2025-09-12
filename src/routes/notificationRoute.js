const express = require("express");
const router = express.Router();
const {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controllers/notificationController.js");

// Create notification
router.post("/", createNotification);

// Get notifications (filter by userId / vetId / shelterId)
router.get("/", getNotifications);

// Mark single notification as read
router.patch("/:id/read", markAsRead);

// Mark all as read for a user/vet/shelter
router.patch("/markAll", markAllAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;
