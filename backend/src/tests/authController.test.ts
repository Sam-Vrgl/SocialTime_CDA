// tests/authController.test.ts

import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';
import { register, login, logout } from '../controllers/authController';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrisma),
    Role: { USER: 'USER' },
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../utils/jwt', () => ({
  signToken: jest.fn(),
}));

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  const prismaMock = (PrismaClient as jest.Mock).mock.results[0].value;

  beforeEach(() => {
    req = { body: {} };
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock,
    };
    // Clear mock history
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user and return its id', async () => {
      req.body = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'secret123',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-secret');
      (prismaMock.user.create as jest.Mock).mockResolvedValue({ id: 42 });

      await register(req as Request, res as Response);

      expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          passwordHash: 'hashed-secret',
          role: Role.USER,
        },
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ id: 42 });
    });

    it('should return 400 on error', async () => {
      req.body = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'secret123',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-secret');
      (prismaMock.user.create as jest.Mock).mockRejectedValue(new Error('Failed to create'));

      await register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create' });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      req.body = { email: 'noone@example.com', password: 'pass' };
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = { email: 'user@example.com', password: 'wrongpass' };
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: 7,
        passwordHash: 'hashed',
        role: Role.USER,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req as Request, res as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpass', 'hashed');
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return a token if credentials are valid', async () => {
      req.body = { email: 'user@example.com', password: 'rightpass' };
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: 7,
        passwordHash: 'hashed',
        role: Role.USER,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (signToken as jest.Mock).mockReturnValue('jwt-token');

      await login(req as Request, res as Response);

      expect(signToken).toHaveBeenCalledWith({ sub: 7, role: Role.USER });
      expect(jsonMock).toHaveBeenCalledWith({ token: 'jwt-token' });
    });

    it('should return 500 on server error', async () => {
      req.body = { email: 'user@example.com', password: 'pass' };
      (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB down'));

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('logout', () => {
    it('should send a logout message', () => {
      logout({} as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Logged out. Please discard your token client-side.',
      });
    });
  });
});
