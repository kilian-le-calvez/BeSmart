import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from '@topic/service/topic.service';
import { TopicController } from './topic.controller';
import { User } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

describe('TopicController', () => {
  let controller: TopicController;
  let mockTopicService: Partial<Record<keyof TopicService, jest.Mock>>;

  beforeEach(async () => {
    mockTopicService = {
      // Mock methods of TopicService here
      // For example:
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      // etc.
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [{ provide: TopicService, useValue: mockTopicService }],
    }).compile();

    controller = module.get<TopicController>(TopicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic and return a success response', async () => {
      const mockCreateTopicDto = {
        title: 'Test Topic',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
      };
      const mockUser = { id: 'user-id' } as User;
      const mockTopicResponse = {
        id: 'topic-id',
        title: 'Test Topic',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
      };

      mockTopicService.create.mockResolvedValue(mockTopicResponse);

      const result = await controller.create(mockCreateTopicDto, mockUser);

      expect(mockTopicService.create).toHaveBeenCalledWith(
        mockUser.id,
        mockCreateTopicDto,
      );
      expect(result).toEqual({
        message: 'Topic created successfully',
        data: mockTopicResponse,
      });
    });

    it('should throw an error if topic creation fails', async () => {
      const mockCreateTopicDto = {
        title: 'Test Topic',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
      };
      const mockUser = { id: 'user-id' } as User;

      mockTopicService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(
        controller.create(mockCreateTopicDto, mockUser),
      ).rejects.toThrow('Creation failed');
      expect(mockTopicService.create).toHaveBeenCalledWith(
        mockUser.id,
        mockCreateTopicDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const mockTopics = [
        { id: 'topic1', title: 'Topic 1', description: 'Description 1' },
        { id: 'topic2', title: 'Topic 2', description: 'Description 2' },
      ];

      mockTopicService.findAll = jest.fn().mockResolvedValue(mockTopics);

      const result = await controller.findAll();

      expect(mockTopicService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'List of topics',
        data: mockTopics,
      });
    });

    it('should throw an error if fetching topics fails', async () => {
      mockTopicService.findAll = jest
        .fn()
        .mockRejectedValue(new Error('Fetch failed'));

      await expect(controller.findAll()).rejects.toThrow('Fetch failed');
      expect(mockTopicService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a topic by its ID', async () => {
      const mockTopicId = 'topic-id';
      const mockTopicResponse = {
        id: mockTopicId,
        title: 'Test Topic',
        description: 'Test Description',
      };

      mockTopicService.findOne = jest.fn().mockResolvedValue(mockTopicResponse);

      const result = await controller.findOne(mockTopicId);

      expect(mockTopicService.findOne).toHaveBeenCalledWith(mockTopicId);
      expect(result).toEqual({
        message: 'Topic found',
        data: mockTopicResponse,
      });
    });

    it('should throw an error if fetching the topic fails', async () => {
      const mockTopicId = 'topic-id';

      mockTopicService.findOne = jest
        .fn()
        .mockRejectedValue(new Error('Fetch failed'));

      await expect(controller.findOne(mockTopicId)).rejects.toThrow(
        'Fetch failed',
      );
      expect(mockTopicService.findOne).toHaveBeenCalledWith(mockTopicId);
    });
  });

  describe('delete', () => {
    it('should delete a topic and return a success message', async () => {
      const mockTopicId = 'topic-id';
      const mockUser = { id: 'user-id' } as User;
      const mockDeletedTopicTitle = 'Deleted Topic';

      mockTopicService.unauthorizedOwner = jest.fn();
      mockTopicService.delete = jest
        .fn()
        .mockResolvedValue(mockDeletedTopicTitle);

      const result = await controller.delete(mockTopicId, mockUser);

      expect(mockTopicService.unauthorizedOwner).toHaveBeenCalledWith(
        mockUser.id,
        mockTopicId,
      );
      expect(mockTopicService.delete).toHaveBeenCalledWith(mockTopicId);
      expect(result).toEqual({
        message: `Topic "${mockDeletedTopicTitle}" deleted successfully`,
      });
    });

    it('should throw an error if the user is not the owner of the topic', async () => {
      const mockTopicId = 'topic-id';
      const mockUser = { id: 'user-id' } as User;

      mockTopicService.unauthorizedOwner = jest.fn().mockImplementation(() => {
        throw new ForbiddenException('Unauthorized');
      });

      await expect(controller.delete(mockTopicId, mockUser)).rejects.toThrow(
        'Unauthorized',
      );
      expect(mockTopicService.unauthorizedOwner).toHaveBeenCalledWith(
        mockUser.id,
        mockTopicId,
      );
      expect(mockTopicService.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if deleting the topic fails', async () => {
      const mockTopicId = 'topic-id';
      const mockUser = { id: 'user-id' } as User;

      mockTopicService.unauthorizedOwner = jest.fn();
      mockTopicService.delete = jest
        .fn()
        .mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.delete(mockTopicId, mockUser)).rejects.toThrow(
        'Deletion failed',
      );
      expect(mockTopicService.unauthorizedOwner).toHaveBeenCalledWith(
        mockUser.id,
        mockTopicId,
      );
      expect(mockTopicService.delete).toHaveBeenCalledWith(mockTopicId);
    });
  });

  describe('update', () => {
    it('should update a topic and return a success response', async () => {
      const mockTopicId = 'topic-id';
      const mockUpdateTopicDto = {
        title: 'Updated Topic',
        description: 'Updated Description',
      };
      const mockUser = { id: 'user-id' } as User;
      const mockUpdatedTopicResponse = {
        id: mockTopicId,
        title: 'Updated Topic',
        description: 'Updated Description',
      };

      mockTopicService.unauthorizedOwner = jest.fn();
      mockTopicService.update = jest
        .fn()
        .mockResolvedValue(mockUpdatedTopicResponse);

      const result = await controller.update(
        mockTopicId,
        mockUpdateTopicDto,
        mockUser,
      );

      expect(mockTopicService.unauthorizedOwner).toHaveBeenCalledWith(
        mockUser.id,
        mockTopicId,
      );
      expect(mockTopicService.update).toHaveBeenCalledWith(
        mockTopicId,
        mockUpdateTopicDto,
      );
      expect(result).toEqual({
        message: `Topic "${mockUpdatedTopicResponse.title}" updated successfully`,
        data: mockUpdatedTopicResponse,
      });
    });

    it('should throw an error if the user is not the owner of the topic', async () => {
      const mockTopicId = 'topic-id';
      const mockUpdateTopicDto = {
        title: 'Updated Topic',
        description: 'Updated Description',
      };
      const mockUser = { id: 'user-id' } as User;

      mockTopicService.unauthorizedOwner = jest.fn().mockImplementation(() => {
        throw new ForbiddenException('Unauthorized');
      });

      await expect(
        controller.update(mockTopicId, mockUpdateTopicDto, mockUser),
      ).rejects.toThrow('Unauthorized');
      expect(mockTopicService.unauthorizedOwner).toHaveBeenCalledWith(
        mockUser.id,
        mockTopicId,
      );
      expect(mockTopicService.update).not.toHaveBeenCalled();
    });

    it('should throw an error if updating the topic fails', async () => {
      const mockTopicId = 'topic-id';
      const mockUpdateTopicDto = {
        title: 'Updated Topic',
        description: 'Updated Description',
      };
      const mockUser = { id: 'user-id' } as User;

      mockTopicService.unauthorizedOwner = jest.fn();
      mockTopicService.update = jest
        .fn()
        .mockRejectedValue(new Error('Update failed'));

      await expect(
        controller.update(mockTopicId, mockUpdateTopicDto, mockUser),
      ).rejects.toThrow('Update failed');
      expect(mockTopicService.unauthorizedOwner).toHaveBeenCalledWith(
        mockUser.id,
        mockTopicId,
      );
      expect(mockTopicService.update).toHaveBeenCalledWith(
        mockTopicId,
        mockUpdateTopicDto,
      );
    });
  });
});
