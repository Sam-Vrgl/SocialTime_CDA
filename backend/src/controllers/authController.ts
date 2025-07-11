import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function register(
  req: Request,
  res: Response
): Promise<void> {
  const {
    username,
    firstName,
    lastName,
    email,
    password
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        passwordHash: hash,
        role: Role.USER
      }
    });
    res.status(201).json({ id: user.id });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function login(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken({
      sub:  user.id,
      role: user.role
    });
    const { passwordHash, ...publicUser } = user;

    res.json({ token, user: publicUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export function logout(
  _req: Request,
  res: Response
): void {
  // With stateless JWT you typically just let the client delete the token.
  res.json({ message: 'Logged out. Please discard your token client-side.' });
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.sub;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { passwordHash, ...publicUser } = user;
    res.json(publicUser);
  } catch (err) {
    console.error('Error in /auth/me:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
