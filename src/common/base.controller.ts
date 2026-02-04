import { Response, Router } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IControllerRoute } from './route.interface';

export abstract class ABaseController {
  #router: Router;
  #logger: LoggerService;

  constructor(logger: LoggerService) {
    this.#router = Router();
    this.#logger = logger;
  }

  get router() {
    return this.#router;
  }

  send<T>(res: Response, code: number, message: T) {
    return res.status(code).json(message);
  }


  ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  created(res: Response) {
    return res.status(201);
  }

  #bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.#logger.log(`[${route.method}] ${route.path}`);
      this.router[route.method](route.path, route.func.bind(this));
    }
  }
}