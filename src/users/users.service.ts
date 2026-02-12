import { inject, injectable } from 'inversify';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface.';
import { User } from './user.entity';
import { dependencyType } from '../dependencyTypes';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(dependencyType.configService)
    private configService: IConfigService
  ) {}
  async createUser({ email, name, password }: UserRegisterDTO) {
    const newUser = new User(email!, name!);
    await newUser.setHashedPassword(password!);

    return newUser;
  }
  async validateUser(_dto: UserLoginDTO) {
    return await Promise.resolve(true);
  }
}
