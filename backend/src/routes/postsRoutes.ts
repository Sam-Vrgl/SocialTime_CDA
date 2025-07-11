// src/routes/postRoutes.ts

import { Router } from 'express';
import { createPost, getAllPosts } from '../controllers/postsController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

// POST /posts       → create a new post (any authenticated user)
router.post('/', requireAuth, createPost);

// GET  /posts       → list all posts (admin only)
// router.get('/', requireAuth, requireAdmin, getAllPosts);
router.get('/', getAllPosts);

export default router;
