import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@config';

const jwtSecret = JWT_SECRET as string;

// Sign a token with the private key
const signedToken = (payload: Object) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
};

// Verify a token with the public key
const verifyToken = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, jwtSecret) as T;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export { signedToken, verifyToken, cookieOptions };
