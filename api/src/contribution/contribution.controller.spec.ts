import { Test, TestingModule } from '@nestjs/testing';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
// import { ContributionService } from './contribution.service';

describe('ContributionController', () => {
  let controller: ContributionController;
  let mockAuthService: Partial<Record<keyof ContributionService, jest.Mock>>;

  beforeEach(async () => {
    mockAuthService = {
      // Define mock methods for ContributionService if needed
      // For example:
      // createContribution: jest.fn(),
      // getContributions: jest.fn(),
      // getContributionById: jest.fn(),
      // updateContribution: jest.fn(),
      // deleteContribution: jest.fn(),
      // etc.
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionController],
      providers: [{ provide: ContributionService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<ContributionController>(ContributionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
