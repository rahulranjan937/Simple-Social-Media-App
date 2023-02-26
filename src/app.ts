import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from '@utils/connectDB';
import { PORT, NODE_ENV } from '@config';

import ApiVersionMiddleware from '@middlewares/apiVersionMiddleware';
import router from '@routes/index';

console.log(`NODE_ENV: ${NODE_ENV}`);

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Logger
if (NODE_ENV === 'development') app.use(morgan('dev'));

// Cors
app.use(cors());

// API Version Middleware (Set the version of the API in Header)
// Get the version of the API from Header

app.use(ApiVersionMiddleware.setVersion('1'));

// Main Routes
app.use('/', router);

// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(PORT ?? 3333, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});
