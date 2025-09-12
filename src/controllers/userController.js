const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt")

const register = async (req, res) => {
    try {
        const { name, contactNumber, email, address, role, password } = req.body;

        if (!name || !contactNumber || !email || !address || !password) {
            return res.status(400).json({
                message: "All fields are required",
                isSave: false
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long", isSave: false });
        }

        const validRoles = ["owner", "vet", "shelter", "admin"];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
                isSave: false
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
                isSave: false
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            contactNumber,
            email,
            address,
            role: role || "owner",
            password: hashedPass
        });


        return res.status(201).json({
            message: "User Registered Successfully",
            isSave: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                number: newUser.contactNumber
            },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: error.message,
            isSave: false
        });
    }
};

const deleteuser = async (req, res) => {
    try {
        const {email} = req.body; 

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                isDeleted: false
            });
        }

        const result = await userModel.deleteOne({ email });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "User not found",
                isDeleted: false
            });
        }

        return res.status(200).json({
            message: "User account deleted successfully",
            isDeleted: true
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: error.message,
            isDeleted: false
        });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password"); 
        return res.status(200).json({
            message: "Users fetched successfully",
            count: users.length,
            users
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.user.id;
        
        const user = await userModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};


module.exports = { register,deleteuser,getUserById,getAllUsers };