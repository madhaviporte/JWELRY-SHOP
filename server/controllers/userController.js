const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
};

const addAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, state, postalCode, country, isDefault } = req.body;

    if (!fullName || !phone || !address || !city || !state || !postalCode) {
      return res.status(400).json({ success: false, message: "All address fields are required" });
    }

    const user = await User.findById(req.user._id);

    // If this is set as default, unset others
    if (isDefault) {
      user.address = user.address || [];
      user.address.forEach((a) => (a.isDefault = false));
    }

    user.address = user.address || [];
    user.address.push({
      fullName,
      phone,
      address,
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: isDefault || user.address.length === 0,
    });

    await user.save();

    res.status(201).json({ success: true, addresses: user.address });
  } catch (error) {
    console.error("Add address error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add address" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.address.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const { fullName, phone, address: addr, city, state, postalCode, country, isDefault } = req.body;

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (addr) address.address = addr;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;

    if (isDefault) {
      user.address.forEach((a) => (a.isDefault = false));
      address.isDefault = true;
    }

    await user.save();

    res.status(200).json({ success: true, addresses: user.address });
  } catch (error) {
    console.error("Update address error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.address.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    address.deleteOne();

    // If deleted address was default, make first remaining default
    if (address.isDefault && user.address.length > 0) {
      user.address[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({ success: true, addresses: user.address });
  } catch (error) {
    console.error("Delete address error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
};
