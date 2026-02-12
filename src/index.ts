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
import { IUsersService } from './users/users.service.interface.';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';

const containerModule = new ContainerModule(
  ({ bind }: ContainerModuleLoadOptions) => {
    bind<App>(dependencyType.app).to(App);
    bind<ILogger>(dependencyType.iLogger).to(LoggerService);
    bind<ABaseController>(dependencyType.userConroller).to(UsersController);
    bind<IExceptionFilter>(dependencyType.exceptionFilter).to(ExceptionFilter);
    bind<IUsersService>(dependencyType.usersService).to(UsersService);
    bind<IConfigService>(dependencyType.configService)
      .to(ConfigService)
      .inSingletonScope();
  }
);

const dependencyContainer = new Container();
dependencyContainer.load(containerModule);
const app = dependencyContainer.get<App>(dependencyType.app);
app.main();
