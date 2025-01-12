import express from "express";
import {
  changeCurrentPassword,
  forgotPassword,
  resetPassword,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js"; // Middleware to verify user authentication

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// User Logout
router.post("/logout", isAuthenticated, logoutUser);

// Change Current Password
router.put("/change-password", isAuthenticated, changeCurrentPassword);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Update User
router.put("/update/:id", isAuthenticated, updateUser);

export default router;
