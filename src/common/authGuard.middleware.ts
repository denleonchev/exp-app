import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { HTTPError } from '../errors/httpError';

import { IMiddleware } from './middleware.interface';
export class AuthGuardMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction) {
    const unauthorizedError = new HTTPError(401, 'Unauthorized');
    if (req.headers.authorization) {
      const [, jwt] = req.headers.authorization.split(' ');
      verify(jwt, this.secret, (badJWTError) => {
        if (badJWTError) {
          next(unauthorizedError);
        } else {
          next();
        }
      });
    } else {
      next(unauthorizedError);
    }
  }
}
