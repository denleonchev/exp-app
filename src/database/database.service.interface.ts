import { PrismaClient } from '../generated/prisma/client';

export interface IDatabaseService {
  client: PrismaClient;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}
