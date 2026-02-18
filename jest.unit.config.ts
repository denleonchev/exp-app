import { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/*.spec.ts'],
};

export default config;
