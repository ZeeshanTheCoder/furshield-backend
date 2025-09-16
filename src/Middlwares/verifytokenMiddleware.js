// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Get token from "Bearer <token>"
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
        });
      }

      // Save user data in request for further use
      req.user = decoded; // { id: user._id, role: user.role }
      console.log("Decoded Token =>", decoded);
      next();
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error in token verification",
    });
  }
};

module.exports = verifyToken;
