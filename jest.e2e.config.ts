import { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './e2e',
  testMatch: ['**/*.e2e-spec.ts'],
};

export default config;
