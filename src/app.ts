import 'reflect-metadata';
import { inject } from 'inversify';
import express, { type Express } from 'express';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { dependencyType } from './dependencyTypes';
import { ILogger } from './logger/logger.interface';
import { json } from 'body-parser';

export class App {
  private app: Express;
  private port: number;

  constructor(
    @inject(dependencyType.iLogger) private logger: ILogger,
    @inject(dependencyType.userConroller)
    private userController: UsersController,
    @inject(dependencyType.exceptionFilter)
    private exceptionFilter: ExceptionFilter
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

  private userMiddleware() {
    this.app.use(json());
  }

  private useExceptionFilters() {
    const context = this.exceptionFilter;
    this.app.use(this.exceptionFilter.catch.bind(context));
  }

  async main() {
    this.userMiddleware();
    this.useRoutes();
    this.useExceptionFilters();
    this.app.listen(this.port, () => {
      this.logger.log(`Server is running on localhost:${this.port}`);
    });
  }
}
