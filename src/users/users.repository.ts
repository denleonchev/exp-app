import { inject } from 'inversify';

import { IDatabaseService } from '../database/database.service.interface';
import { dependencyType } from '../dependencyTypes';

import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';

export class UsersRepository implements IUsersRepository {
  constructor(
    @inject(dependencyType.databaseService)
    private databaseService: IDatabaseService
  ) {}

  createUser(user: User) {
    return this.databaseService.client.userModel.create({
      data: {
        email: user.getEmail(),
        name: user.getName(),
        password: user.getHashedPassword(),
      },
    });
  }

  findUserByEmail(email: string) {
    return this.databaseService.client.userModel.findUnique({
      where: {
        email,
      },
    });
  }
}
