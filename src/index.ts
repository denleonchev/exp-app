import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';

const loggerService = new LoggerService();
const app = new App(loggerService, new UsersController(loggerService));

app.main();