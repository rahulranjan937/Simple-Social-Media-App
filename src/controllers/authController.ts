import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from '@interfaces/IUser';
import { LoginUserInput, RegisterUserInput } from '@/schema/userSchema';
import { signedToken, cookieOptions } from '@utils/jwt';

class AuthController {
  private userService = new UserService();

  public register = async (req: Request<{}, RegisterUserInput['body']>, res: Response, next: NextFunction) => {
    try {
      // payload
      const payload = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      };

      // Check if user already exists
      const userEmail = await this.userService.getUserByQuery({ email: payload.email });
      if (userEmail) return res.status(400).json({ message: 'User already exists' });

      // Check if username already exists
      const userUsername = await this.userService.getUserByQuery({ username: payload.username });
      if (userUsername) return res.status(400).json({ message: 'Username already exists, Please chnage it' });

      // Hash password before saving in database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(payload.password, salt);
      payload.password = hashedPassword;

      // Create new user
      const newUser = await this.userService.createUser(payload);

      // Payload for JWT
      const payloadJWT = { user: { id: newUser._id } };

      // Create token
      const _token = signedToken(payloadJWT);

      if (!_token) return res.status(500).json({ message: 'Token not found' });

      // Set cookies
      res.cookie('access_token', _token, cookieOptions);
      res.cookie('logged_in', true, { ...cookieOptions, httpOnly: false });

      res.status(201).json({
        message: 'User created successfully',
        data: newUser._id,
        token: _token,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  // Login user API
  public login = async (req: Request<{}, LoginUserInput['body']>, res: Response, next: NextFunction) => {
    try {
      // payload
      const payload = {
        email: req.body.email,
        password: req.body.password,
      };

      // Check if user exists
      const user = await this.userService.getUserByQuery({ email: payload.email });
      if (!user) return res.status(400).json({ message: 'User does not exist' });

      // Check if password is correct
      const isMatch = await bcrypt.compare(payload.password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Payload for JWT
      const payloadJWT = { user: { id: user._id } };

      // Create token
      const _token = signedToken(payloadJWT);
      if (!_token) return res.status(500).json({ message: 'Token not found' });

      // Set cookies
      res.cookie('access_token', _token, cookieOptions);
      res.cookie('logged_in', true, { ...cookieOptions, httpOnly: false });

      // Send response
      return res.status(200).json({
        token: _token,
        data: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  // Logout user API
  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cookies
      res.clearCookie('access_token');
      res.clearCookie('logged_in');
      res.clearCookie('token');

      // Send response
      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}

export { AuthController };
