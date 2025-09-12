const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // ek user ka ek hi cart
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: { type: Number, default: 1, min: 1 }
    }],
    totalPrice: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;