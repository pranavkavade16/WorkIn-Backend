const generateToken = require("../utils/generateToken");

const User = require("../models/user.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProtectedData = (req, res) => {
  res.json({
    message: "Protected route accessible",
    user: req.user,
  });
};
