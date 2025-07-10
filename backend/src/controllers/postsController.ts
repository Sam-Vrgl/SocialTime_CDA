import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createPost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const authorId = req.user!.sub;              // set by requireAuth
    const { description } = req.body as { description?: string };

    if (!description || description.trim() === '') {
      res.status(400).json({ error: 'Description is required' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        description: description.trim(),
        authorId,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
