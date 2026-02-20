import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { AuthGuardMiddleware } from '../common/authGuard.middleware';
import { ABaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { dependencyType } from '../dependencyTypes';
import { HTTPError } from '../errors/httpError';
import { ILogger } from '../logger/logger.interface';

import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface.';




@injectable()
export class UsersController extends ABaseController {
  constructor(
    @inject(dependencyType.iLogger) logger: ILogger,
    @inject(dependencyType.usersService) private usersService: IUsersService,
    @inject(dependencyType.configService) private configService: IConfigService
  ) {
    super(logger);
    const secret = configService.get('SECRET');
    if (!secret) {
      throw new Error('SECRET is required env var');
    }
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDTO)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [new AuthGuardMiddleware(secret)],
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

  private async login(
    req: Request<unknown, unknown, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ) {
    const validationResult = await this.usersService.validateUser(req.body);
    if (!validationResult) {
      return next(new HTTPError(401, 'Auth error', 'login'));
    }
    const secret = this.configService.get('SECRET');
    if (!secret) {
      throw new Error('SECRET env var is required');
    }
    const jwt = await this.signJWT(req.body.email, secret);
    this.ok(res, { jwt });
  }

  private async info(req: Request, res: Response, next: NextFunction) {
    const email = req.email!;
    const user = await this.usersService.getUser(email);
    if (!user) {
      return next(new HTTPError(404, 'No such user', 'info'));
    }
    this.ok(res, { id: user.id, name: user.name, email: user.email });
  }

  private async signJWT(email: string, secret: string) {
    return await new Promise<string>((resolve, reject) => {
      sign(
        { email, iat: Math.floor(Date.now() / 1000) },
        secret,
        { algorithm: 'HS256' },
        (err, token) => {
          if (err) {
            return reject(err);
          }

          if (!token) {
            return reject(
              new Error('There are problems with token generation')
            );
          }

          resolve(token);
        }
      );
    });
  }
}
