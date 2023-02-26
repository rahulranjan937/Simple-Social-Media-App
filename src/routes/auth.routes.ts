import { Router } from 'express';

const router = Router();

import { AuthController } from '@controllers/authController';
import { PasswdController } from '@/controllers/passwdController';

import AuthMiddleware from '@middlewares/authMiddleware';
import validateSchema from '@/middlewares/validateSchema';

import { loginUserSchema, registerUserSchema, forgetPasswordSchema, resetPasswordSchema } from '@schema/userSchema';

const Auth = new AuthController();
const authMiddleware = new AuthMiddleware();
const Password = new PasswdController();

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 * @access  Public
 * @body    name, email and password
 */
router.post('/register', validateSchema(registerUserSchema), Auth.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    email and password
 */
router.post('/login', validateSchema(loginUserSchema), Auth.login);

/**
 * @route   POST /api/auth/forgotpassword
 * @desc    Forgot password
 * @access  Public
 * @body    email
 */
router.post('/forgotpassword', validateSchema(forgetPasswordSchema), Password.forgotPassword);

/**
 * @route   PUT /api/auth/resetpassword
 * @desc    Reset password
 * @access  Public
 * @body    password (new password) and resettoken
 */
router.post('/resetpassword', validateSchema(resetPasswordSchema), Password.resetPassword);

/**
 * @route   GET /api/auth/changepassword
 * @desc    Change password
 * @access  Private
 * @body    password (old password) and newpassword
 */
router.get('/changepassword', authMiddleware.isAuthenticated, authMiddleware.requireUser, Password.changePassword);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authMiddleware.isAuthenticated, authMiddleware.requireUser, Auth.logout);

export default router;
