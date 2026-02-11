import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { ABaseController } from '../common/base.controller';
import { HTTPError } from '../errors/httpError';
import { dependencyType } from '../dependencyTypes';
import { ILogger } from '../logger/logger.interface';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { IUsersService } from './users.service.interface.';

@injectable()
export class UsersController extends ABaseController {
  constructor(
    @inject(dependencyType.iLogger) logger: ILogger,
    @inject(dependencyType.usersService) private usersService: IUsersService
  ) {
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

  private async register(
    req: Request<unknown, unknown, UserRegisterDTO>,
    res: Response,
    next: NextFunction
  ) {
    const newUser = await this.usersService.createUser(req.body);
    if (!newUser) {
      return next(new HTTPError(422, 'User exists'));
    }
    this.ok(res, newUser);
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
