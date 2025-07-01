// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function register(
  req: Request,
  res: Response
): Promise<void> {
  const { pseudo_utilisateur, nom_utilisateur, prenom_utilisateur, email_utilisateur, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.utilisateur.create({
      data: {
        pseudo_utilisateur,
        nom_utilisateur,
        prenom_utilisateur,
        email_utilisateur,
        mdp_hash: hash,
        role_utilisateur: 'USER'
      }
    });
    res.status(201).json({ id: user.id_utilisateur });
    return;
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
    return;
  }
}

export async function login(
  req: Request,
  res: Response
): Promise<void> {
  const { email_utilisateur, password } = req.body;
  try {
    const user = await prisma.utilisateur.findUnique({ where: { email_utilisateur } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.mdp_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = signToken({ sub: user.id_utilisateur, role: user.role_utilisateur });
    res.json({ token });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
    return;
  }
}

export function logout(
  req: Request,
  res: Response
): void {
  // If you were using an http-only cookie you’d clear it here:
  //    res.clearCookie('token');
  res.json({ message: 'Logged out. Please delete your token on the client.' });
}
