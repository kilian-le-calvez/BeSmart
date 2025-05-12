export interface MockPrismaService {
  topic: {
    findUnique: jest.Mock;
    create: jest.Mock;
    findMany: jest.Mock;
    findUniqueOrThrow: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  thread: {
    findUnique: jest.Mock;
    create: jest.Mock;
    findMany: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  user: {
    create: jest.Mock;
    findUnique: jest.Mock;
  };
}

const getMockPrismaService = (): MockPrismaService => ({
  topic: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  thread: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
});

export default getMockPrismaService;
