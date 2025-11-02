const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");
const isProduction = process.env.NODE_ENV === "production";

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        isLogin: false,
      });
    }

    // 2. Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        isLogin: false,
      });
    }

    // 3. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        isLogin: false,
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET, // store secret in .env
      { expiresIn: "1h" } // token expires in 1 hour
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // true in live (HTTPS)
      sameSite: isProduction ? "None" : "Lax", // None in live, Lax in dev
      // domain: isProduction ? "furshield-backend-rnqw.onrender.com" : undefined,
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // 5. Return success response
    return res.status(200).json({
      message: "Login successful",
      isLogin: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message,
      isLogin: false,
    });
  }
};

const logoutuser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "Token not found",
        isLogout: false,
      });
    }

    // clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax", // None in live, Lax in dev
    });

    return res.status(200).json({
      message: "Logged out successfully",
      isLogout: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message,
      isLogout: false,
    });
  }
};

module.exports = { loginuser, logoutuser };
