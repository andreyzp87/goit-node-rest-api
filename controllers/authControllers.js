import bcrypt from 'bcryptjs';
import authService from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await authService.getUserByEmail(email);

    if (existingUser) {
      throw HttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authService.createUser(email, hashedPassword);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.getUserByEmail(email);

    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = authService.generateToken(user.id);
    const result = await authService.updateUserToken(user.id, token);

    if (!result) {
      throw HttpError(401, 'Email or password is wrong');
    }

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.updateUserToken(req.user.id, null);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
