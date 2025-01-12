import express from "express";
import { changeCurrentPassword } from "../controllers/changePasswordController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { loginUser } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { registerUser } from "../controllers/signupController.js";
import { updateUser } from "../controllers/updateProfile.js";
import { verifyJWT } from "../middleware/jwtAuth.js";

const userRoute = express.Router();

// User Registration
userRoute.post("/register", registerUser);

// User Login
userRoute.post("/login", loginUser);

// User Logout
userRoute.post("/logout", verifyJWT, logoutUser);

// Change Current Password
userRoute.put("/change-password", verifyJWT, changeCurrentPassword);

// Forgot Password
userRoute.post("/forgot-password", forgotPassword);

// Reset Password
userRoute.post("/reset-password", resetPassword);

// Update User
userRoute.put("/update/:id", verifyJWT, updateUser);

export { userRoute };
