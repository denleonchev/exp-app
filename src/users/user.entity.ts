import { compare, hash } from 'bcryptjs';

export class User {
  private hashedPassword!: string;
  constructor(
    private readonly email: string,
    private readonly name: string
  ) {}

  getEmail() {
    return this.email;
  }

  getName() {
    return this.name;
  }

  getHashedPassword() {
    return this.hashedPassword;
  }

  setHashedPassword(hashedPassword: string) {
    this.hashedPassword = hashedPassword;
  }

  async createHashedPassword(password: string, salt: number) {
    return await hash(password, salt);
  }

  async comparePasswords(password: string) {
    return await compare(password, this.getHashedPassword());
  }
}
