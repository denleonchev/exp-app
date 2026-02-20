import 'reflect-metadata';
import { Container } from 'inversify';

import { ConfigService } from '../config/config.service';
import { IConfigService } from '../config/config.service.interface';
import { dependencyType } from '../dependencyTypes';

import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface.';

const configServiceMock: IConfigService = {
  databaseURL: 'testUrl',
  salt: 1,
  secret: 'secret'
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

  it('should return null when creating user with existing email', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1');
    usersRepository.findUserByEmail = jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'hashedPassword',
    });

    const createdUser = await usersService.createUser({
      email: 'existing@example.com',
      name: 'New User',
      password: 'password123',
    });

    expect(createdUser).toBeNull();
  });

  it('should validate user with correct credentials', async () => {
    const user = new User('test@example.com', 'Test User');
    user.setHashedPassword('hashedPassword');

    usersRepository.findUserByEmail = jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    jest.spyOn(User.prototype, 'comparePasswords').mockResolvedValueOnce(true);

    const isValid = await usersService.validateUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(isValid).toBe(true);
  });

  it('should return false when validating with incorrect credentials', async () => {
    usersRepository.findUserByEmail = jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    jest.spyOn(User.prototype, 'comparePasswords').mockResolvedValueOnce(false);

    const isValid = await usersService.validateUser({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(isValid).toBe(false);
  });

  it('should return false when validating nonexistent user', async () => {
    usersRepository.findUserByEmail = jest.fn().mockResolvedValueOnce(null);

    const isValid = await usersService.validateUser({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(isValid).toBe(false);
  });

  it('should get user by email', async () => {
    usersRepository.findUserByEmail = jest.fn().mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    const user = await usersService.getUser('test@example.com');

    expect(user).not.toBeNull();
    expect(user!.id).toEqual(1);
    expect(user!.email).toEqual('test@example.com');
  });

  it('should return null when getting nonexistent user', async () => {
    usersRepository.findUserByEmail = jest.fn().mockResolvedValueOnce(null);

    const user = await usersService.getUser('nonexistent@example.com');

    expect(user).toBeNull();
  });
});
