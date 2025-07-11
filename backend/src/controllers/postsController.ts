// src/controllers/postsController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createPost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const authorId = req.user!.sub;
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

/**
 * GET /posts
 * Admin-only: returns all posts with their image URLs
 */
export async function getAllPosts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true }
        }
      }
    });

    // Map to include imageUrl
    const results = posts.map(post => ({
      id: post.id,
      description: post.description,
      created_at: post.created_at,
      author: post.author,
      imageUrl: post.gridFsImageId
        ? `/images/${post.gridFsImageId}`
        : null,
    }));

    res.json(results);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
}