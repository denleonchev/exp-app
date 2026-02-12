import { inject, injectable } from 'inversify';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface.';
import { User } from './user.entity';
import { dependencyType } from '../dependencyTypes';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';

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
    const salt = Number(this.configService.get('SALT'));
    if (!salt) {
      throw new Error('SALT env var is required');
    }
    await newUser.setHashedPassword(password, salt);
    return this.usersRepository.createUser(newUser);
  }

  async validateUser(_dto: UserLoginDTO) {
    return await Promise.resolve(true);
  }
}
