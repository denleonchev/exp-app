import express, { type Express } from 'express';
import { usersRouter } from './users/users';
import { Server } from 'node:http';
import { LoggerService } from './logger/logger.service';

export class App {
  #app: Express;
  #server?: Server;
  #port: number;
  #logger: LoggerService;

  constructor(logger: LoggerService) {
    this.#app = express();
    this.#port = 8000;
    this.#logger = logger;
  }

  #useRoutes() {
    this.#app.use('/users', usersRouter);
  }

  async main() {
    this.#useRoutes();
    this.#server = this.#app.listen(this.#port, () => {
      this.#logger.log(`Server is running on localhost:${this.#port}`);
    });
  }
}
