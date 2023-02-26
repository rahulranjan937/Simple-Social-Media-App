import { Request, Response, NextFunction } from 'express';

type APIVersion = '1' | '2';

class ApiVersionMiddleware {
  public static setHeaders = (req: Request, res: Response, next: NextFunction) => {
    const apiVersion = req.headers['x-api-version'];
    console.log(apiVersion);
    console.log(req.headers);

    if (!apiVersion) {
      return res.status(400).json({
        message: 'API version is required',
      });
    }

    handleApiVersion(apiVersion as APIVersion);
    console.log(getCurrentVersion());

    next();
  };

  // Set the version of the API in Header
  public static setVersion(version: APIVersion): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log(req.headers);
      console.log('setVersion');
      console.log(version);

      res.setHeader('X-API-Version', version);
      console.log(res.getHeaders());

      res.locals.apiVersion = version;
      next();
    };
  }

  // Get the version of the API from Header
  public static getVersion(req: Request) {
    return req.headers['X-API-Version'];
  }

  // Check if the version of the API is the same as the one passed
  public static checkVersion(version: APIVersion) {
    return (req: Request, res: Response, next: NextFunction) => {
      const apiVersion = ApiVersionMiddleware.getVersion(req);
      if (apiVersion === version) {
        next();
      } else {
        res.status(400).json({
          status: 'error',
          message: `Version ${version} is required`,
        });
      }
    };
  }

  // Check if the version of the API is greater than the one passed
  public static checkVersionGreaterThan(version: APIVersion) {
    return (req: Request, res: Response, next: NextFunction) => {
      const apiVersion = ApiVersionMiddleware.getVersion(req) as APIVersion;
      if (apiVersion >= version) {
        next();
      } else {
        res.status(400).json({
          status: 'error',
          message: `Version ${version} is required`,
        });
      }
    };
  }
}

export function apiVersionMiddleware(version: APIVersion): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-API-Version', version);
    next();
  };
}

let currentVersion: APIVersion = '1'; // default version

export function handleApiVersion(apiVersion: string) {
  if (apiVersion === '1' || apiVersion === '2') {
    currentVersion = apiVersion as APIVersion;
  } else {
    throw new Error(`Unsupported API version: ${apiVersion}`);
  }
}

export function getCurrentVersion(): APIVersion {
  return currentVersion;
}

export default ApiVersionMiddleware;
