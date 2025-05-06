import { Test, TestingModule } from '@nestjs/testing';
import { ThreadController } from './thread.controller';
import { ThreadService } from '@thread/service/thread.service';

describe('ThreadController', () => {
  let controller: ThreadController;
  let mockThreadService: Partial<Record<keyof ThreadService, jest.Mock>>;

  beforeEach(async () => {
    mockThreadService = {
      // Mock methods of ThreadService here
      // For example:
      // findAll: jest.fn(),
      // findById: jest.fn(),
      create: jest.fn(),
      // update: jest.fn(),
      // delete: jest.fn(),
      // etc.
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadController],
      providers: [{ provide: ThreadService, useValue: mockThreadService }],
    }).compile();

    controller = module.get<ThreadController>(ThreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
