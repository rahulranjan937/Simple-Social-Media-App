import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

const router = Router();

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import postRoutes from './post.routes';

const status = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 'success',
    message: 'Server is running',
  });
};

router.route('/').get(status);

/**
 * @description Auth Routes - /api/auth - Public Routes
 * @APIVersion 1
 * @middleware apiVersionMiddleware
 */
router.use('/api/auth', authRoutes);

/**
 * @description User Routes - /api/user - Public Routes
 * @APIVersion 1
 * @middleware apiVersionMiddleware
 * @middleware auth
 * @middleware upload
 */
router.use('/api/user', userRoutes);

/**
 * @description Post Routes - /api/post - Private Routes
 * @APIVersion 1
 * @middleware apiVersionMiddleware
 * @middleware auth
 * @middleware upload
 */
router.use('/api/post', postRoutes);

export default router;
