import express, { type Express } from 'express';
import { usersRouter } from './users/users';
import { Server } from 'node:http';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';

export class App {
  #app: Express;
  #server?: Server;
  #port: number;
  #logger: LoggerService;
  userController: UsersController;

  constructor(logger: LoggerService, userController: UsersController) {
    this.#app = express();
    this.#port = 8000;
    this.#logger = logger;
    this.userController = userController;
  }

  #useRoutes() {
    this.#app.use('/users', this.userController.router);
  }

  async main() {
    this.#useRoutes();
    this.#server = this.#app.listen(this.#port, () => {
      this.#logger.log(`Server is running on localhost:${this.#port}`);
    });
  }
}
