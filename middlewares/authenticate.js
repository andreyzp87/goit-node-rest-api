import HttpError from '../helpers/HttpError.js';
import authServices from '../services/authServices.js';

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(HttpError(401, 'Not authorized'));
  }

  try {
    const { id } = authServices.verifyToken(token);
    const user = await authServices.getUserById(id);

    if (!user || !user.token || user.token !== token) {
      return next(HttpError(401, 'Not authorized'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
};

export default authenticate;
