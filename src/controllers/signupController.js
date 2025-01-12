import { User } from "../models/userModel.js";

const registerUser = async (req, res) => {
  try {
    const { email, password,username } = req.body;

    // Validation
    if (
      [username, email, password].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        data: null,
      });
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        message: "User with this email already exists",
        success: false,
        data: null,
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while registering the user",
      success: false,
      error: error.message,
    });
  }
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  return res.status(500).json({
    message: err.message || "An unexpected error occurred",
    success: false,
    data: null,
  });
};

export { registerUser, errorHandler };
