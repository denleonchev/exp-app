import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';
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
