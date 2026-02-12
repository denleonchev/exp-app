import { injectable } from 'inversify';
import { IConfigService } from './config.service.interface';

injectable();
export class ConfigService implements IConfigService {
  constructor() {
    console.log('Instanciated ConfigService');
  }

  get(key: string) {
    return process.env[key];
  }
}
