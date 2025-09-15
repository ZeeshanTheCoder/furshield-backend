// controllers/productController.js
const productModel = require("../models/productSchema.js");
const imagekit = require("../Utils/imagekit.utils.js");

const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Name, category, and price are required",
      });
    }

    let imageUrl = null;

    // Agar image aayi hai to ImageKit pe upload karo
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer, // multer se buffer milega
        fileName: req.file.originalname,
        folder: "products", // optional: ImageKit folder
      });
      imageUrl = uploadResponse.url;
    }

    const product = await productModel.create({
      name,
      category,
      price,
      description,
      stock,
      image: imageUrl, // image URL save hoga db me
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};


const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;

        let filter = {};

        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (search) {
            filter.name = { $regex: search, $options: "i" }; 
        }

        const products = await productModel.find(filter);

        return res.status(200).json({ count: products.length, products });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
