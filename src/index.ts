import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { dependencyType } from './dependencyTypes';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ABaseController } from './common/base.controller';

const containerModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<App>(dependencyType.app).to(App);
    bind<ILogger>(dependencyType.iLogger).to(LoggerService);
    bind<ABaseController>(dependencyType.userConroller).to(UsersController);
    bind<IExceptionFilter>(dependencyType.exceptionFilter).to(ExceptionFilter);
  }
);

const dependencyContainer = new Container();
dependencyContainer.load(containerModule);
const app = dependencyContainer.get<App>(dependencyType.app);
app.main();
