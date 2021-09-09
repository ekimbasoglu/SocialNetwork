const { User } = require('../models/user');
const error = require('./errorHandling/errorConstants');

/**
 * Ensure that requested User has proper permissions
 * @param roles
 */
module.exports.permissionAccess = (...roles) => async (req, res, next) => {
  try {
    const { _id: loggedInUser, iat: tokenIssuedAt } = req.user;

    const user = await User.findById(loggedInUser).lean();

    if (!user) {
      throw new Error(error.FORBIDDEN);
    }

    const { isDeleted, isActive } = user;

    if (isDeleted) throw new Error(error.NOT_FOUND);

    if (!isActive) throw new Error(error.FORBIDDEN);

    // check if user changed password after the token was issued
    if (user.passwordChangedAt) {
      // add 1000ms because of latency when updating password
      if (tokenIssuedAt * 1000 + 1000 < user.passwordChangedAt.getTime()) {
        throw new Error(error.CREDENTIALS_ERROR);
      }
    }

    if (roles.length) {
      const permissions = roles.includes(user.role);

      if (!permissions) {
        throw new Error(error.FORBIDDEN);
      }
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
