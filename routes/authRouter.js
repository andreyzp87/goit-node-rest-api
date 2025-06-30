import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/usersSchemas.js';
import {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
} from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/current', authenticate, getCurrent);
authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  updateAvatar
);

export default authRouter;
