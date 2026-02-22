const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    next();
  } catch (error) {
    return res
      .status(402)
      .json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = verifyJWT;
