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
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersController extends ABaseController {
  constructor(
    @inject(dependencyType.iLogger) logger: ILogger,
    @inject(dependencyType.usersService) private usersService: IUsersService,
    @inject(dependencyType.configService) private configService: IConfigService
  ) {
    super(logger);
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
