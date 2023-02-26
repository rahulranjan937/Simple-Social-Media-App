import { Router } from 'express';

const router = Router();

import AuthMiddleware from '@middlewares/authMiddleware';

import { UserController } from '@/controllers/userController';

const authMiddleware = new AuthMiddleware();
const User = new UserController();

/**
 * @route   GET /api/user/:username
 * @desc    Get user by username
 * @access  Private
 * @params  username
 */
router.get('/:username', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUserByUsername);

/**
 * @route   GET /api/user/:username/followers
 * @desc    Get user followers
 * @access  Private
 * @params  username
 */
router.get('/:username/followers', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUserFollowers);

/**
 * @route   GET /api/user/:username/following
 * @desc    Get user following
 * @access  Private
 * @params  username
 */
router.get('/:username/following', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUserFollowing);

/**
 * @route   GET /api/user/:username/follow
 * @desc    Follow user
 * @access  Private
 * @params  username
 */
router.get('/:username/follow', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.followUser);

/**
 * @route   GET /api/user/:username/unfollow
 * @desc    Unfollow user
 * @access  Private
 * @params  username
 */
router.get('/:username/unfollow', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.unfollowUser);

export default router;
