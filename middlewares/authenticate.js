import HttpError from '../helpers/HttpError.js';
import User from '../db/models/User.js';

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(HttpError(401, 'Not authorized'));
  }

  try {
    // Find user by token
    const user = await User.findOne({ where: { token } });

    if (!user) {
      return next(HttpError(401, 'Not authorized'));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
};

export default authenticate;
