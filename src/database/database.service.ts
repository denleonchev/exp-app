import { inject, injectable } from 'inversify';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { dependencyType } from '../dependencyTypes';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { IDatabaseService } from './database.service.interface';

@injectable()
export class DatabaseService implements IDatabaseService {
  client: PrismaClient;

  constructor(
    @inject(dependencyType.configService) configService: IConfigService,
    @inject(dependencyType.iLogger) private logger: ILogger
  ) {
    const databaseUrl = configService.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL env var is required');
    }
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    this.client = new PrismaClient({ adapter });
  }

  async connect() {
    try {
      await this.client.$connect();
      this.logger.log('Connected to the database');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to connect to the database');
        this.logger.error(error.message);
      }
    }
  }

  async disconnect() {
    this.client.$disconnect();
  }
}
