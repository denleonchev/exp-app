import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';

const loggerService = new LoggerService();
const app = new App(
  loggerService,
  new UsersController(loggerService),
  new ExceptionFilter(loggerService)
);

app.main();
