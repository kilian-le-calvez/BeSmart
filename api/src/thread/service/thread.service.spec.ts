import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@prisma-api/prisma.service';
import { ThreadService } from './thread.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('ThreadService', () => {
  let service: ThreadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ThreadService>(ThreadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
