import * as authService from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    if (error.message === 'Email in use') {
      next(HttpError(409, 'Email in use'));
      return;
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({
      token: result.token,
      user: {
        email: result.user.email,
        subscription: result.user.subscription,
      },
    });
  } catch (error) {
    if (error.message === 'Email or password is wrong') {
      next(HttpError(401, 'Email or password is wrong'));
      return;
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await authService.logout(id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};
