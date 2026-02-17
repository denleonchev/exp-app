import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface.';
import { dependencyType } from '../dependencyTypes';
import { UsersService } from './users.service';
import { ConfigService } from '../config/config.service';
import { User } from './user.entity';

const configServiceMock: IConfigService = {
  get: jest.fn(),
};
const usersRepositoryMock: IUsersRepository = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
  container.bind<IUsersService>(dependencyType.usersService).to(UsersService);
  container
    .bind<ConfigService>(dependencyType.configService)
    .toConstantValue(configServiceMock);
  container
    .bind<IUsersRepository>(dependencyType.usersRepository)
    .toConstantValue(usersRepositoryMock);

  configService = container.get<IConfigService>(dependencyType.configService);
  usersRepository = container.get<IUsersRepository>(
    dependencyType.usersRepository
  );
  usersService = container.get<IUsersService>(dependencyType.usersService);
});

describe('Users Service', () => {
  it('createuser', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1');
    usersRepository.createUser = jest
      .fn()
      .mockImplementationOnce((user: User) => ({
        name: user.getName(),
        email: user.getEmail(),
        id: 1,
        password: user.getHashedPassword(),
      }));
    const createdUser = await usersService.createUser({
      email: 'a@a.ua',
      name: 'Dzen',
      password: '1',
    });

    expect(createdUser!.id).toEqual(1);
    expect(createdUser!.password).not.toEqual('1');
  });
});
