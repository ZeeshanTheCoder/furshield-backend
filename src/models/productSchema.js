const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['food', 'toys', 'grooming', 'accessories'],
        required: true
    },
    price: { type: Number, required: true },
    description: String,
    image: String, // single image URL
    stock: { type: Number, default: 0 },
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema)
module.exports = productModel;