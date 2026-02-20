import { inject, injectable } from 'inversify';

import { IConfigService } from '../config/config.service.interface';
import { dependencyType } from '../dependencyTypes';

import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface.';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(dependencyType.configService)
    private configService: IConfigService,
    @inject(dependencyType.usersRepository)
    private usersRepository: IUsersRepository
  ) {}
  async createUser({ email, name, password }: UserRegisterDTO) {
    const existingUser = await this.usersRepository.findUserByEmail(email);
    if (existingUser) {
      return null;
    }
    const newUser = new User(email, name);
    const salt = this.configService.salt;
    const hashedPassword = await newUser.createHashedPassword(password, salt);
    newUser.setHashedPassword(hashedPassword);
    return this.usersRepository.createUser(newUser);
  }

  async validateUser({ email, password }: UserLoginDTO) {
    const existingUser = await this.usersRepository.findUserByEmail(email);
    if (!existingUser) {
      return false;
    }

    const user = new User(existingUser.email, existingUser.name);
    user.setHashedPassword(existingUser.password);
    return await user.comparePasswords(password);
  }

  async getUser(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    if (user) {
      return user;
    }

    return null;
  }
}
