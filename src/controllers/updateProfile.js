import { User } from "../models/userModel.js";

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    // Validation
    if (
      [firstname, lastname, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    const emailTaken = await User.findOne({ email, _id: { $ne: id } });
    if (emailTaken) {
      return res.status(409).json({ message: "Email is already taken" });
    }

    // Update user information
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    if (password) {
      user.password = password; // Assuming password hashing middleware is in place
    }
    await user.save();

    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problem occurred during updating user", error });
  }
};

export { updateUser };
