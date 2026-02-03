import { App } from './app';
import { LoggerService } from './logger/logger.service';

const app = new App(new LoggerService());

app.main();