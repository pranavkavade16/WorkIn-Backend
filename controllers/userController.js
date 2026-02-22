const User = require('../models/user.model');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: 'Invalid input, please enter a valid name.' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        message: 'Inavlid input, please enter a valid email address.',
      });
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(200).json({ savedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create an user.', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      res.status(404).json({ message: 'No users found.' });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch the users data.',
      error: error.message,
    });
  }
};
