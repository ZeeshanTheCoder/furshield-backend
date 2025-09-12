const express = require("express");
const router = express.Router();
const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController.js");

// Add item to cart
router.post("/add", addToCart);

// Get user cart
router.get("/:userId", getCart);

// Update item quantity
router.put("/update", updateCartItem);

// Remove item
router.delete("/remove", removeCartItem);

// Clear cart
router.delete("/clear/:userId", clearCart);

module.exports = router;
