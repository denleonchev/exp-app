import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';

import { dependencyType } from '../dependencyTypes';
import { ILogger } from '../logger/logger.interface';

import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './httpError';


injectable();
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(dependencyType.iLogger) private logger: ILogger) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Error ${err.statusCode}: ${err.message}`
      );
      return res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      return res.status(500).send({ err: err.message });
    }
  }
}
