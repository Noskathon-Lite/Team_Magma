import { User } from "../models/userModel.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // Generate 4-digit reset code
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash code and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetCode).digest("hex");

    // Set token expiration time
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    // Create email message
    const message = `You are receiving this email because you have requested the reset of a password. Please use the following code to reset your password: \n\n ${resetCode}`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Password reset code",
      message,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email could not be sent", error: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { resetCode, password } = req.body;

    // Hash the code
    const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");

    // Find user by code and check if the code has not expired
    const user = await User.findOne({
      resetPasswordToken: hashedCode,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export { forgotPassword, resetPassword };
