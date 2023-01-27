import { config } from 'dotenv';

const PATH = '.env';

if (!PATH) {
  throw new Error('The .env file is missing');
}

config({ path: PATH });

export const {
  HOST,
  NODE_ENV,
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  FROM_EMAIL,
  AZURE_STORAGE_CONNECTION_STRING,
} = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is missing');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

if (!MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY is missing');
}

if (!MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_DOMAIN is missing');
}

if (!FROM_EMAIL) {
  throw new Error('FROM_EMAIL is missing');
}

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING is missing');
}
