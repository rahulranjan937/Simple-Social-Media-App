import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';

import upload from '@/utils/upload';

import { PostController } from '@/controllers/postController';

const Post = new PostController();

const authMiddleware = new AuthMiddleware();
/**
 * @route   POST /api/v1/post/create
 * @desc    Create a post
 * @access  Private
 */
router.post('/create', authMiddleware.isAuthenticated, authMiddleware.requireUser, upload.any(), Post.createPost);

/**
 * @route   GET /api/v1/post
 * @desc    Get all posts
 * @access  Private
 */
router.get('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, upload.any(), Post.getPosts);

/**
 * @route   GET /api/v1/post/:id
 * @desc    Get a post
 * @access  Private
 */

router.get('/:id', authMiddleware.isAuthenticated, authMiddleware.requireUser, upload.any(), Post.getPost);

/**
 * @route   DELETE /api/v1/post/:id/delete
 * @desc    Delete a post
 * @access  Private
 * @params  id
 */
router.delete('/:id/delete', authMiddleware.isAuthenticated, authMiddleware.requireUser, upload.any(), Post.deletePost);

export default router;
