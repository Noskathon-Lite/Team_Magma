import { User } from "../models/userModel.js";

//logout user
const logoutUser = async (req, res) => {
  try {
    // Invalidate tokens on the server side (optional)
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      },
    );

    // Respond to the client
    return res.status(200).json( {message: "User logged out" });
  }
   catch (error) {
    return res.status(500).json({
        message: "Error logging out user",
        error: error.message || "An error occurred",
      });
  }
};
export { logoutUser };
