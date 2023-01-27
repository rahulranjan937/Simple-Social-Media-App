import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

const router = Router();

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
 * @description User Routes - /api/v1/user - Public Routes
 */
router.use('/api/v1/user', userRoutes);

/**
 * @description Post Routes - /api/v1/post - Private Routes
 * @middleware auth
 * @middleware upload
 */
router.use('/api/v1/post', postRoutes);

export default router;
