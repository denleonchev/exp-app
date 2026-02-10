import { Container } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { dependencyType } from './dependencyTypes';
import { IExceptionFilter } from './errors/exception.filter.interface';

const dependencyContainer = new Container();
dependencyContainer.bind<App>(dependencyType.app).to(App);
dependencyContainer.bind<ILogger>(dependencyType.iLogger).to(LoggerService);
dependencyContainer
  .bind<UsersController>(dependencyType.userConroller)
  .to(UsersController);
dependencyContainer
  .bind<IExceptionFilter>(dependencyType.exceptionFilter)
  .to(ExceptionFilter);
const app = dependencyContainer.get<App>(dependencyType.app);
app.main();
