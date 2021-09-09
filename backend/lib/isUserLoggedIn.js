const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

module.exports.isUserLoggedIn = async (req, res, next) => {
  // 1. getting token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ').pop();
  }

  if (!token) {
    return next();
  }

  // 2. verification token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next();
  }

  // 3. check if user still exists
  const currentUser = await User.findById(decoded._id);
  if (!currentUser) {
    return next();
  }

  // 4. check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    // add 1000ms because of latency when updating password
    const tokenIssuedAt = decoded.iat * 1000 + 1000;
    if (tokenIssuedAt < currentUser.passwordChangedAt.getTime()) {
      return next();
    }
  }

  req.user = currentUser;
  return next();
};
