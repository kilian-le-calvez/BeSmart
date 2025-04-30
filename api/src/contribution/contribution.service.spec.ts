import { Test, TestingModule } from '@nestjs/testing';
import { ContributionService } from './contribution.service';
import { PrismaService } from '@prisma-api/prisma.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('ContributionService', () => {
  let service: ContributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ContributionService>(ContributionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
