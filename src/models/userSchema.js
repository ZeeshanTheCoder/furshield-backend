const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    address: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["owner", "vet", "shelter", "admin"],
      default: "owner",
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
