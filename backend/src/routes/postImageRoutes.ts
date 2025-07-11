// src/routes/postImageRoutes.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import { getBucket } from '../utils/mongo';
import { requireAuth } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
});

/**
 * POST /posts/:postId/image
 */
router.post(
  '/posts/:postId/image',
  requireAuth,
  upload.single('image'),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const bucket = getBucket();

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        userId: req.user!.sub,
        postId: req.params.postId,
      },
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });

    uploadStream.on('finish', async () => {
      const fileId = uploadStream.id.toString();
      try {
        await prisma.post.update({
          where: { id: req.params.postId },
          data: { gridFsImageId: fileId },
        });
        res.json({ imageUrl: `/images/${fileId}` });
      } catch (err) {
        console.error('Error saving image ID to post:', err);
        res.status(500).json({ error: 'Could not save image reference' });
      }
    });

    uploadStream.end(req.file.buffer);
  }
);

/**
 * GET /images/:id
 */
router.get(
  '/images/:id',
  (req: Request, res: Response): void => {
    const id = req.params.id;
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      res.sendStatus(400);
      return;
    }

    // again, grab bucket at request time
    const bucket = getBucket();
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', () => {
      res.sendStatus(404);
    });

    downloadStream.pipe(res);
  }
);

export default router;
