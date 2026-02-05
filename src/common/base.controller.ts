import { Response, Router } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IControllerRoute } from './route.interface';

export abstract class ABaseController {
  protected _router: Router;
  protected logger: LoggerService;

  constructor(logger: LoggerService) {
    this._router = Router();
    this.logger = logger;
  }

  public get router() {
    return this._router;
  }

  protected send<T>(res: Response, code: number, message: T) {
    return res.status(code).json(message);
  }

  protected ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  protected created(res: Response) {
    return res.status(201);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      this._router[route.method](route.path, route.func.bind(this));
    }
  }
}
