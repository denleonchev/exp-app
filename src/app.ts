import 'reflect-metadata';
import { Server } from 'node:http';

import { json } from 'body-parser';
import express, { type Express } from 'express';
import { inject } from 'inversify';

import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';
import { IDatabaseService } from './database/database.service.interface';
import { dependencyType } from './dependencyTypes';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { UsersController } from './users/users.controller';

export class App {
  private app: Express;
  private port: number;
  server?: Server;

  constructor(
    @inject(dependencyType.iLogger) private logger: ILogger,
    @inject(dependencyType.userConroller)
    private userController: UsersController,
    @inject(dependencyType.exceptionFilter)
    private exceptionFilter: ExceptionFilter,
    @inject(dependencyType.databaseService)
    private databaseService: IDatabaseService,
    @inject(dependencyType.configService) private configService: IConfigService
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
    const secret = this.configService.get('SECRET');
    if (!secret) {
      throw new Error('SECRET env var is required');
    }
    const authMiddleware = new AuthMiddleware(secret);
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  private useExceptionFilters() {
    const context = this.exceptionFilter;
    this.app.use(this.exceptionFilter.catch.bind(context));
  }

  async main() {
    this.userMiddleware();
    this.useRoutes();
    this.useExceptionFilters();
    await this.databaseService.connect();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server is running on localhost:${this.port}`);
    });
  }

  close() {
    this.server?.close();
  }
}
