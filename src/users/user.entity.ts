import { hash } from 'bcryptjs';

export class User {
  private hashedPassword?: string;
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

  async setHashedPassword(password: string) {
    const salt = 10;
    this.hashedPassword = await hash(password, salt);
  }
}
