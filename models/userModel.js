const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }

  },

  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
