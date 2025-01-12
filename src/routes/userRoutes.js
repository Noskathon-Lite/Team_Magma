import express from "express";
import {changeCurrentPassword} from "../controllers/changePasswordController.js"
import{forgotPassword} from "../controllers/forgotPasswordController.js"
import {loginUser} from "../controllers/loginController.js"
import { logoutUser } from "../controllers/logoutController.js";
import {registerUser} from "../controllers/signupController.js"
import { updateUser } from "../controllers/updateProfile.js";

import { verifyJWT } from "../middleware/jwtAuth.js"; 
const userRoute = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// User Logout
router.post("/logout", verifyJWT, logoutUser);

// Change Current Password
router.put("/change-password", verifyJWT, changeCurrentPassword);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Update User
router.put("/update/:id", verifyJWT, updateUser);

export  {userRoute};
