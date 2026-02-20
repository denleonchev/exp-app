import 'reflect-metadata';
import { injectable } from 'inversify';
import { ILogObj, Logger } from 'tslog';

import { ILogger } from './logger.interface';

@injectable()
export class LoggerService implements ILogger {
  private logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger();
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}
