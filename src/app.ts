import express, { type Express } from 'express';
import { usersRouter } from './users/users';
import { Server } from 'node:http';

export class App {
  #app: Express;
  #server?: Server;
  #port: number;

  constructor() {
    this.#app = express();
    this.#port = 8000;
  }

  #useRoutes() {
    this.#app.use('/users', usersRouter);
  }

  async main() {
    this.#useRoutes();
    this.#server = this.#app.listen(this.#port, () => {
      console.log(`Server is running on localhost:${this.#port}`);
    });
  }
}
