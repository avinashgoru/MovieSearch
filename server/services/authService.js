import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw Object.assign(new Error('Please provide all required fields'), { status: 400 });
  }

  if (password.length < 6) {
    throw Object.assign(new Error('Password must be at least 6 characters'), { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check existing user
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw Object.assign(new Error('User already exists'), { status: 409 });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash
  });

  return user;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Object.assign(new Error('Please provide email and password'), { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Find user and explicitly select passwordHash
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  return user;
};

export const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};
