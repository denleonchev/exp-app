import { NextFunction, Request, Response } from 'express';
import { ABaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { HTTPError } from '../errors/httpError';

export class UsersController extends ABaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register
      },
      {
        path: '/login',
        method: 'post',
        func: this.login
      },
    ]);
  }

  private register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'register');
  }


  private login(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, 'Auth error', 'login'));
    // this.ok(res, 'login');
  }
}