import { IsNotEmpty, IsNumber, validate } from 'class-validator';
import { injectable } from 'inversify';

import { IConfigService } from './config.service.interface';

injectable();
export class ConfigService implements IConfigService {
  @IsNotEmpty()
  databaseURL = process.env.DATABASE_URL!

  @IsNotEmpty()
  salt = Number(process.env.SALT!)

  @IsNotEmpty()
  secret = process.env.SECRET!

  async validate() {
    const errors = await validate(this);
    if (errors.length) {
      const errorText = errors.map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints).join(';\n');
        }
      }).join('; ');

      throw new Error(errorText)
    }
  }
}
