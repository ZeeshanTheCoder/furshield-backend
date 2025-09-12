const cartModel = require("../models/cartSchema.js");
const productModel = require("../models/productSchema.js");

const calculateTotal = async (items) => {
    let total = 0;
    for (let item of items) {
        const product = await productModel.findById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            // Create new cart if not exists
            cart = new cartModel({
                userId,
                items: [{ productId, quantity }],
            });
        } else {
            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity || 1;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        cart.totalPrice = await calculateTotal(cart.items);
        cart.updatedAt = Date.now();

        await cart.save();

        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartModel.findOne({ userId }).populate("items.productId");

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: "Item not in cart" });

        cart.items[itemIndex].quantity = quantity;
        cart.totalPrice = await calculateTotal(cart.items);
        cart.updatedAt = Date.now();

        await cart.save();

        res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalPrice = await calculateTotal(cart.items);
        cart.updatedAt = Date.now();

        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        let cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        cart.totalPrice = 0;
        cart.updatedAt = Date.now();

        await cart.save();

        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
};
