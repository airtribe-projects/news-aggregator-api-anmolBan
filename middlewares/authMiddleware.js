const jwt = require('jsonwebtoken');
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.split(' ')[1]) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email, name, preferences } = decoded;

    const user = await User.findById(id);

    if (!user || user.email !== email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = { id, email, name, preferences };

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }

  next();
}

module.exports = { authMiddleware };