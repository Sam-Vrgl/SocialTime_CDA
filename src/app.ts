// src/app.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import { requireAuth } from './middleware/authMiddleware';


const app = express();
const prisma = new PrismaClient();
const PORT: number = Number(process.env.PORT) || 3000;


app.use(express.json());
app.use('/auth', authRoutes);

app.get('/me', requireAuth, (req, res) => {
  // res.json(...) here returns void
  res.json({ userId: req.user!.sub, role: req.user!.role });
});


/* TEMPORARY ROUTES */

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
app.get('test/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.utilisateur.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Unable to load users' });
  }
});

/* TEMPORARY ROUTES END */


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
