import User from "../models/user.model.js"

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body

    // Build update object
    const updateFields = {}
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (email) updateFields.email = email

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true, runValidators: true })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findById(req.user.id).select("+password")

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}
