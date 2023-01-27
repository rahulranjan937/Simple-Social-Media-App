import { Router } from 'express';

const router = Router();

import { AuthController } from '@controllers/authController';
import { PasswdController } from '@/controllers/passwdController';
import { UserController } from '@/controllers/userController';

import AuthMiddleware from '@middlewares/authMiddleware';
import validateSchema from '@/middlewares/validateSchema';

import { loginUserSchema, registerUserSchema, forgetPasswordSchema, resetPasswordSchema } from '@schema/userSchema';

const Auth = new AuthController();
const authMiddleware = new AuthMiddleware();
const Password = new PasswdController();
const User = new UserController();

/**
 * @route   POST /api/v1/user/register
 * @desc    Register user
 * @access  Public
 * @body    name, email and password
 */
router.post('/register', validateSchema(registerUserSchema), Auth.register);

/**
 * @route   POST /api/v1/user/login
 * @desc    Login user
 * @access  Public
 * @body    email and password
 */
router.post('/login', validateSchema(loginUserSchema), Auth.login);

/**
 * @route   POST /api/v1/user/forgotpassword
 * @desc    Forgot password
 * @access  Public
 * @body    email
 */
router.post('/forgotpassword', validateSchema(forgetPasswordSchema), Password.forgotPassword);

/**
 * @route   PUT /api/v1/user/resetpassword
 * @desc    Reset password
 * @access  Public
 * @body    password (new password) and resettoken
 */
router.post('/resetpassword', validateSchema(resetPasswordSchema), Password.resetPassword);

/**
 * @route   GET /api/v1/user/changepassword
 * @desc    Change password
 * @access  Private
 * @body    password (old password) and newpassword
 */
router.get('/changepassword', authMiddleware.isAuthenticated, authMiddleware.requireUser, Password.changePassword);

/**
 * @route   GET /api/v1/user/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authMiddleware.isAuthenticated, authMiddleware.requireUser, Auth.logout);

/**
 * @route   GET /api/v1/user/:username
 * @desc    Get user by username
 * @access  Private
 * @params  username
 */
router.get('/:username', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUserByUsername);

/**
 * @route   GET /api/v1/user/:username/followers
 * @desc    Get user followers
 * @access  Private
 * @params  username
 */
router.get('/:username/followers', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUserFollowers);

/**
 * @route   GET /api/v1/user/:username/following
 * @desc    Get user following
 * @access  Private
 * @params  username
 */
router.get('/:username/following', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUserFollowing);

/**
 * @route   GET /api/v1/user/:username/follow
 * @desc    Follow user
 * @access  Private
 * @params  username
 */
router.get('/:username/follow', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.followUser);

/**
 * @route   GET /api/v1/user/:username/unfollow
 * @desc    Unfollow user
 * @access  Private
 * @params  username
 */
router.get('/:username/unfollow', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.unfollowUser);

export default router;
