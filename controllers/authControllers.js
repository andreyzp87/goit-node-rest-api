import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs';
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
    const avatarURL = gravatar.url(email, {
      s: '250',
      r: 'pg',
      d: 'identicon',
    });

    const user = await authService.createUser(email, hashedPassword, avatarURL);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
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
        avatarURL: user.avatarURL,
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
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'Avatar file is required');
    }

    const { id } = req.user;
    const { path: tempPath, filename } = req.file;

    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');

    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }

    const avatarPath = path.join(avatarsDir, filename);

    try {
      fs.renameSync(tempPath, avatarPath);
    } catch (error) {
      fs.unlinkSync(tempPath);
      throw HttpError(500, 'Failed to save avatar');
    }

    const avatarURL = `/avatars/${filename}`;
    await authService.updateUserAvatar(id, avatarURL);

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
