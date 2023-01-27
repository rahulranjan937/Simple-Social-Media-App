import { NextFunction, Request, Response } from 'express';
import { UserService } from '@interfaces/IUser';
import { verifyToken } from '@utils/jwt';

class AuthMiddleware {
  private userService = new UserService();

  // Authentication Middleware
  public isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let access_token;

      // Get token from header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        access_token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
      }

      if (!access_token) {
        return res.status(401).json({
          message: 'You are not logged in! Please log in to get access.',
        });
      }

      // Verification token
      const decoded = verifyToken<{ user: any; id: string }>(access_token);

      if (!decoded) {
        return res.status(401).json({
          message: 'Invalid Credential. Please log in again!',
        });
      }

      // Check if user still exists
      const currentUser = await this.userService.getUserByQuery({ _id: decoded.user.id });

      if (!currentUser) {
        return res.status(401).json({
          message: 'Credential is expired. Please log in again!',
        });
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      res.locals.user = decoded.user;
      next();
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  // Logged User Middleware
  public requireUser = (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      if (!user) {
        return res.status(401).json({
          message: 'Invalid Credential. Please log in again!',
        });
      }

      next();
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}

export default AuthMiddleware;
