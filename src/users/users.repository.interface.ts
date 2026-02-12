import { UserModel } from '../generated/prisma/client';
import { User } from './user.entity';

export interface IUsersRepository {
  createUser: (user: User) => Promise<UserModel>;
  findUserByEmail: (email: string) => Promise<UserModel | null>;
}
