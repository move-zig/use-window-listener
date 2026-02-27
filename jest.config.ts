import type { Config as SwcConfig } from '@swc/core';
import type { Config as JestConfig } from 'jest';

const swcConfig: SwcConfig = {
  jsc: {
    parser: { syntax: 'typescript', tsx: true },
    target: 'esnext',
  },
  sourceMaps: 'inline',
};

const config: JestConfig = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[cm]?[jt]sx?$': [ '@swc/jest', swcConfig ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@faker-js/faker/)',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(js|mjs|cjs)$': '$1',
  },
  setupFiles: [
    '<rootDir>/jest.env.ts',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  collectCoverage: true,
};

export default config;
