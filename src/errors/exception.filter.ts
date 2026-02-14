import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './httpError';
import { dependencyType } from '../dependencyTypes';
import { ILogger } from '../logger/logger.interface';

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
