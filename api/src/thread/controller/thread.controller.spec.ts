import { Test, TestingModule } from '@nestjs/testing';
import { ThreadController } from './thread.controller';
import { ThreadService } from '@thread/service/thread.service';
import { CurrentUserRequest } from '@common/decorators/current-user.decorator';
import { CreateThreadDto } from '@thread/dto/create-thread.dto';
import getMockPrismaService from '@tests/mock-prisma-service';

describe('ThreadController', () => {
  let controller: ThreadController;
  let mockThreadService: Partial<Record<keyof ThreadService, jest.Mock>>;

  beforeEach(async () => {
    mockThreadService = getMockPrismaService().thread;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadController],
      providers: [{ provide: ThreadService, useValue: mockThreadService }],
    }).compile();

    controller = module.get<ThreadController>(ThreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a thread and return the created thread details', async () => {
      const mockCreateThreadDto: CreateThreadDto = {
        title: 'New Thread',
        topicId: 'topic123',
        starterMessage: 'Hello, this is a new thread!',
        category: 'DISCUSSION',
      };
      const mockUser = { id: '456' } as CurrentUserRequest;
      const mockThreadCreated = { id: '123', title: 'New Thread' };

      mockThreadService.create = jest.fn().mockResolvedValue(mockThreadCreated);

      const result = await controller.create(mockCreateThreadDto, mockUser);

      expect(mockThreadService.create).toHaveBeenCalledWith(
        mockCreateThreadDto,
        mockUser.id,
      );
      expect(result).toEqual({
        message: 'Thread created successfully',
        data: mockThreadCreated,
      });
    });

    it('should throw an error if the service throws an error', async () => {
      const mockCreateThreadDto: CreateThreadDto = {
        title: 'New Thread',
        topicId: 'topic123',
        starterMessage: 'Hello, this is a new thread!',
        category: 'DISCUSSION',
      };
      const mockUser = { id: '456' } as CurrentUserRequest;

      mockThreadService.create = jest
        .fn()
        .mockRejectedValue(new Error('Creation failed'));

      await expect(
        controller.create(mockCreateThreadDto, mockUser),
      ).rejects.toThrow('Creation failed');
      expect(mockThreadService.create).toHaveBeenCalledWith(
        mockCreateThreadDto,
        mockUser.id,
      );
    });
  });

  describe('findByTopic', () => {
    it('should retrieve a list of threads by topic ID and return the thread details', async () => {
      const mockTopicId = 'topic123';
      const mockThreadsFound = [
        { id: '1', title: 'Thread 1' },
        { id: '2', title: 'Thread 2' },
      ];

      mockThreadService.findByTopic = jest
        .fn()
        .mockResolvedValue(mockThreadsFound);

      const result = await controller.findByTopic(mockTopicId);

      expect(mockThreadService.findByTopic).toHaveBeenCalledWith(mockTopicId);
      expect(result).toEqual({
        message: 'Threads found',
        data: mockThreadsFound,
      });
    });

    it('should throw an error if the service throws an error', async () => {
      const mockTopicId = 'topic123';

      mockThreadService.findByTopic = jest
        .fn()
        .mockRejectedValue(new Error('Topic not found'));

      await expect(controller.findByTopic(mockTopicId)).rejects.toThrow(
        'Topic not found',
      );
      expect(mockThreadService.findByTopic).toHaveBeenCalledWith(mockTopicId);
    });
  });

  describe('findOne', () => {
    it('should retrieve a thread by ID and return the thread details', async () => {
      const mockThreadId = '123';
      const mockThreadFound = { id: mockThreadId, title: 'Test Thread' };

      mockThreadService.findOne = jest.fn().mockResolvedValue(mockThreadFound);

      const result = await controller.findOne(mockThreadId);

      expect(mockThreadService.findOne).toHaveBeenCalledWith(mockThreadId);
      expect(result).toEqual({
        message: 'Thread found',
        data: mockThreadFound,
      });
    });

    it('should throw an error if the service throws an error', async () => {
      const mockThreadId = '123';

      mockThreadService.findOne = jest
        .fn()
        .mockRejectedValue(new Error('Thread not found'));

      await expect(controller.findOne(mockThreadId)).rejects.toThrow(
        'Thread not found',
      );
      expect(mockThreadService.findOne).toHaveBeenCalledWith(mockThreadId);
    });
  });

  describe('update', () => {
    it('should update a thread and return the updated thread details', async () => {
      const mockThreadId = '123';
      const mockUpdateThreadDto = { title: 'Updated Title' };
      const mockUser = { id: '456' } as CurrentUserRequest;
      const mockThreadUpdated = { id: mockThreadId, title: 'Updated Title' };

      mockThreadService.update = jest.fn().mockResolvedValue(mockThreadUpdated);

      const result = await controller.update(
        mockThreadId,
        mockUpdateThreadDto,
        mockUser,
      );

      expect(mockThreadService.update).toHaveBeenCalledWith(
        mockThreadId,
        mockUpdateThreadDto,
        mockUser.id,
      );
      expect(result).toEqual({
        message: 'Thread updated successfully',
        data: mockThreadUpdated,
      });
    });

    it('should throw an error if the service throws an error', async () => {
      const mockThreadId = '123';
      const mockUpdateThreadDto = { title: 'Updated Title' };
      const mockUser = { id: '456' } as CurrentUserRequest;

      mockThreadService.update = jest
        .fn()
        .mockRejectedValue(new Error('Update failed'));

      await expect(
        controller.update(mockThreadId, mockUpdateThreadDto, mockUser),
      ).rejects.toThrow('Update failed');
      expect(mockThreadService.update).toHaveBeenCalledWith(
        mockThreadId,
        mockUpdateThreadDto,
        mockUser.id,
      );
    });
  });

  describe('remove', () => {
    it('should delete a thread and return a success message', async () => {
      const mockThreadId = '123';
      const mockUser = { id: '456' } as CurrentUserRequest;
      const mockThreadDeleted = { title: 'Test Thread' };

      mockThreadService.remove = jest.fn().mockResolvedValue(mockThreadDeleted);

      const result = await controller.remove(mockThreadId, mockUser);

      expect(mockThreadService.remove).toHaveBeenCalledWith(
        mockThreadId,
        mockUser.id,
      );
      expect(result).toEqual({
        message: 'Thread deleted successfully: ' + mockThreadDeleted.title,
      });
    });

    it('should throw an error if the service throws an error', async () => {
      const mockThreadId = '123';
      const mockUser = { id: '456' } as CurrentUserRequest;

      mockThreadService.remove = jest
        .fn()
        .mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.remove(mockThreadId, mockUser)).rejects.toThrow(
        'Deletion failed',
      );
      expect(mockThreadService.remove).toHaveBeenCalledWith(
        mockThreadId,
        mockUser.id,
      );
    });
  });
});
