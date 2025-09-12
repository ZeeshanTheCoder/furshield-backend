const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
    vetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vet' },   // optional
    shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' }, // optional
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['vaccination', 'appointment', 'product', 'adoption', 'system'],
        required: true
    },
    read: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index for faster queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ vetId: 1, read: 1 });
notificationSchema.index({ shelterId: 1, read: 1 });

const notificationModel = mongoose.model('Notification', notificationSchema);

module.exports = notificationModel;