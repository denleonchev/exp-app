import express, { type Express } from 'express';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';

export class App {
  private app: Express;
  private port: number;
  private logger: LoggerService;
  userController: UsersController;
  exceptionFilter: ExceptionFilter;

  constructor(
    logger: LoggerService,
    userController: UsersController,
    exceptionFilter: ExceptionFilter
  ) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;
  }

  private useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  private useExceptionFilters() {
    const context = this.exceptionFilter;
    this.app.use(this.exceptionFilter.catch.bind(context));
  }

  async main() {
    this.useRoutes();
    this.useExceptionFilters();
    this.app.listen(this.port, () => {
      this.logger.log(`Server is running on localhost:${this.port}`);
    });
  }
}
