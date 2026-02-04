import { NextFunction, Request, Response } from 'express';
import { ABaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';

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
    this.ok(res, 'login');
  }
}