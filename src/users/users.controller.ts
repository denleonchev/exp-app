import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { ABaseController } from '../common/base.controller';
import { HTTPError } from '../errors/httpError';
import { dependencyType } from '../dependencyTypes';
import { ILogger } from '../logger/logger.interface';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@injectable()
export class UsersController extends ABaseController {
  constructor(@inject(dependencyType.iLogger) logger: ILogger) {
    super(logger);
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register,
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
      },
    ]);
  }

  private register(
    req: Request<unknown, unknown, UserRegisterDTO>,
    res: Response
  ) {
    this.ok(res, 'register');
  }

  private login(
    req: Request<unknown, unknown, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ) {
    next(new HTTPError(401, 'Auth error', 'login'));
    // this.ok(res, 'login');
  }
}
