import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { IMiddleware } from './middleware.interface';
export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const [, jwt] = req.headers.authorization.split(' ');
      verify(jwt, this.secret, (err, payload) => {
        if (err) {
          next(err);
        } else if (typeof payload === 'object') {
          req.email = payload.email;
          next();
        } else {
          next();
        }
      });
    } else {
      next();
    }
  }
}
