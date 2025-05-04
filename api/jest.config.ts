export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts', // you can exclude modules if needed
    '!src/**/*.dto.ts', // exclude DTOs from coverage
    '!src/**/*.response.ts', // exclude response classes from coverage
    '!src/**/*.types.ts', // exclude response classes from coverage
    '!src/**/*.spec.ts', // exclude test files from coverage
    '!src/**/*.e2e-spec.ts', // exclude test files from coverage
    '!src/common/decorators/current-user.decorator.ts', // exclude from coverage
    '!src/main.ts', // exclude main.ts from coverage
  ],
  coverageReporters: ['text', 'html'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@prisma-api/(.*)$': '<rootDir>/src/prisma/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@user/(.*)$': '<rootDir>/src/user/$1',
    '^@topic/(.*)$': '<rootDir>/src/topic/$1',
    '^@thread/(.*)$': '<rootDir>/src/thread/$1',
    '^@contribution/(.*)$': '<rootDir>/src/contribution/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
};
