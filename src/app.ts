// src/app.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT: number = Number(process.env.PORT) || 3000;

// existing routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'This is a test route' });
});

app.get('/hello', (req: Request, res: Response) => {
  const name = (req.query.name as string) || 'stranger';
  res.json({ greeting: `Hello, ${name}!` });
});

// new: fetch and return all users
app.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.utilisateur.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Unable to load users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
