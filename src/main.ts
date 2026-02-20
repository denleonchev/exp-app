import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';

import { App } from './app';
import { ABaseController } from './common/base.controller';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { DatabaseService } from './database/database.service';
import { IDatabaseService } from './database/database.service.interface';
import { dependencyType } from './dependencyTypes';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersService } from './users/users.service';
import { IUsersService } from './users/users.service.interface.';

export const main = async () => {
  const containerModule = new ContainerModule(
    ({ bind }: ContainerModuleLoadOptions) => {
      bind<App>(dependencyType.app).to(App);
      bind<ILogger>(dependencyType.iLogger).to(LoggerService);
      bind<ABaseController>(dependencyType.userConroller).to(UsersController);
      bind<IExceptionFilter>(dependencyType.exceptionFilter).to(
        ExceptionFilter
      );
      bind<IUsersService>(dependencyType.usersService).to(UsersService);
      bind<IConfigService>(dependencyType.configService)
        .to(ConfigService)
        .inSingletonScope();
      bind<IDatabaseService>(dependencyType.databaseService).to(
        DatabaseService
      );
      bind<IUsersRepository>(dependencyType.usersRepository).to(
        UsersRepository
      );
    }
  );

  const dependencyContainer = new Container();
  dependencyContainer.load(containerModule);
  const app = dependencyContainer.get<App>(dependencyType.app);
  await app.main();

  return app;
};
