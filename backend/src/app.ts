import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { connectMongo } from './utils/mongo';
import authRoutes from './routes/authRoutes';
import postsRoutes from './routes/postsRoutes';
import postImageRoutes from './routes/postImageRoutes';
import { requireAuth } from './middleware/authMiddleware';
import { requireAdmin } from './middleware/adminMiddleware';

async function main() {
  // 1) Connect to Mongo/GridFS
  await connectMongo();

  const app = express();
  const prisma = new PrismaClient();
  const PORT = Number(process.env.PORT) || 3000;

  // 2) JSON body parsing
  app.use(express.json());

  // 3) Auth endpoints
  app.use('/auth', authRoutes);

  // 4) Post‐creation endpoint
  //    POST /posts  { description }  → createPost()
  app.use('/posts', postsRoutes);

  // 5) Image upload & serve:
  //    POST /posts/:postId/image  → upload to GridFS + save ID in SQL
  //    GET  /images/:id           → stream from GridFS
  app.use(postImageRoutes);

  // 6) Protected “who am I” route
  app.get(
    '/me',
    requireAuth,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: req.user!.sub },
        });
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        const { passwordHash, ...publicUser } = user;
        res.json(publicUser);
      } catch (err) {
        console.error('Error in /me:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  );

  app.get(
  '/admin/users',
  requireAuth,          // verifies JWT and attaches req.user
  requireAdmin,         // ensures the caller is an ADMIN
  async (_req: Request, res: Response): Promise<void> => {
    try {
      /**  Only expose non-sensitive fields */
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          profilePictureUrl: true,
          bio: true,
          role: true,
          createdAt: true,
        },
      });
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

  /* TEMPORARY ROUTES */

  app.get('/', (_req, res) => {
    res.send('Hello, world!');
  });

  app.get('/test', (_req, res) => {
    res.json({ message: 'This is a test route' });
  });

  app.get('/hello', (req, res) => {
    const name = (req.query.name as string) || 'stranger';
    res.json({ greeting: `Hello, ${name}!` });
  });

  app.get('/test/users', async (_req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Unable to load users' });
    }
  });

  /* END TEMPORARY */

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
