import { Router } from 'express';
import { createPost } from '../controllers/postsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// POST /posts     → create a new post
router.post('/', requireAuth, createPost);

export default router;
