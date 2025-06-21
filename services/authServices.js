import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';

export const register = async (email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error('Email in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const login = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Email or password is wrong');
  }

  // Compare passwords
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new Error('Email or password is wrong');
  }

  // Generate token (using nanoid for simplicity, consider JWT in real-world applications)
  const token =
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Save token to user
  await user.update({ token });

  return {
    token,
    user,
  };
};

export const logout = async userId => {
  await User.update({ token: null }, { where: { id: userId } });
  return true;
};
