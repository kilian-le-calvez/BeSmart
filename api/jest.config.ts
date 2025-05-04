export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
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
