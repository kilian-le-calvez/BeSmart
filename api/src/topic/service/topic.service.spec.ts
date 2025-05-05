import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@prisma-api/prisma.service';
import { TopicService } from './topic.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { Topic } from '@prisma/client';
import { slugify } from '@common/helpers/slugify';
import { UpdateTopicDto } from '@topic/dto/update-topic.dto';

const mockPrismaService = {
  topic: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const createTopicDtoMock = (
  overrides?: Partial<CreateTopicDto>,
): CreateTopicDto => ({
  title: 'Mock Title',
  description: 'Mock Description',
  tags: ['mock'],
  ...overrides,
});

export const topicEntityMock = (overrides?: Partial<Topic>): Topic => ({
  id: 'mock-topic-id',
  title: 'Mock Title',
  slug: 'mock-title',
  description: 'Mock Description',
  tags: ['mock'],
  createdAt: new Date(),
  updatedAt: new Date(),
  visibility: 'PUBLIC',
  createdById: 'mock-user-id',
  ...overrides,
});

describe('TopicService', () => {
  let service: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-id';
    const createTopicDto: CreateTopicDto = createTopicDtoMock();
    const mockTopic: Topic = topicEntityMock();

    it('should create a topic successfully', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);
      mockPrismaService.topic.create.mockResolvedValue(mockTopic);

      const result = await service.create(userId, createTopicDto);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { slug: slugify(createTopicDto.title) },
      });
      expect(mockPrismaService.topic.create).toHaveBeenCalledWith({
        data: {
          ...createTopicDto,
          slug: slugify(createTopicDto.title),
          createdById: userId,
        },
      });
      expect(result).toEqual(mockTopic);
    });

    it('should throw ConflictException if a topic with the same slug exists', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(mockTopic);

      await expect(service.create(userId, createTopicDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { slug: mockTopic.slug },
      });
      expect(mockPrismaService.topic.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const mockTopics: Topic[] = [
      topicEntityMock({
        id: 'topic-id-1',
        title: 'Topic 1',
        slug: 'topic-1',
      }),
      topicEntityMock({
        id: 'topic-id-2',
        title: 'Topic 2',
        slug: 'topic-2',
      }),
    ];

    it('should return all topics', async () => {
      mockPrismaService.topic.findMany.mockResolvedValue(mockTopics);

      const result = await service.findAll();

      expect(mockPrismaService.topic.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockTopics);
    });

    it('should return an empty array if no topics are found', async () => {
      mockPrismaService.topic.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockPrismaService.topic.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe('findOne', () => {
    const topicId = 'mock-topic-id';
    const mockTopic: Topic = topicEntityMock();

    it('should return the topic if found', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(mockTopic);

      const result = await service.findOne(topicId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
      });
      expect(result).toEqual(mockTopic);
    });

    it('should throw NotFoundException if the topic is not found', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.findOne(topicId)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
      });
    });
  });
  describe('delete', () => {
    const topicId = 'mock-topic-id';
    const mockTopic: Topic = topicEntityMock();

    it('should delete the topic and return its title', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(mockTopic);
      mockPrismaService.topic.delete.mockResolvedValue(mockTopic);

      const result = await service.delete(topicId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
      });
      expect(mockPrismaService.topic.delete).toHaveBeenCalledWith({
        where: { id: topicId },
      });
      expect(result).toEqual(mockTopic.title);
    });

    it('should throw NotFoundException if the topic is not found', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.delete(topicId)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
      });
      expect(mockPrismaService.topic.delete).not.toHaveBeenCalled();
    });
  });

  describe('isOwner', () => {
    const userId = 'mock-user-id';
    const topicId = 'mock-topic-id';

    it('should return true if the user is the owner of the topic', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue({
        createdById: userId,
      });

      const result = await service.isOwner(userId, topicId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
        select: { createdById: true },
      });
      expect(result).toBe(true);
    });

    it('should return false if the user is not the owner of the topic', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue({
        createdById: 'different-user-id',
      });

      const result = await service.isOwner(userId, topicId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
        select: { createdById: true },
      });
      expect(result).toBe(false);
    });

    it('should throw NotFoundException if the topic is not found', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.isOwner(userId, topicId)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
        select: { createdById: true },
      });
    });
  });

  describe('unauthorizedOwner', () => {
    const userId = 'mock-user-id';
    const topicId = 'mock-topic-id';

    it('should not throw an exception if the user is the owner', async () => {
      service.isOwner = jest.fn().mockResolvedValue(true);

      await expect(
        service.unauthorizedOwner(userId, topicId),
      ).resolves.not.toThrow();

      expect(service.isOwner).toHaveBeenCalledWith(userId, topicId);
    });

    it('should throw ForbiddenException if the user is not the owner', async () => {
      service.isOwner = jest.fn().mockResolvedValue(false);

      await expect(service.unauthorizedOwner(userId, topicId)).rejects.toThrow(
        ForbiddenException,
      );

      expect(service.isOwner).toHaveBeenCalledWith(userId, topicId);
    });
  });

  describe('update', () => {
    const topicId = 'mock-topic-id';
    const updateTopicDto: UpdateTopicDto = {
      title: 'Updated Title',
      description: 'Updated Description',
      tags: ['updated'],
    };
    const mockUpdatedTopic: Topic = topicEntityMock({
      id: topicId,
      title: updateTopicDto.title,
      slug: slugify(updateTopicDto.title),
      description: updateTopicDto.description,
      tags: updateTopicDto.tags,
    });

    it('should update the topic successfully', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);
      mockPrismaService.topic.update.mockResolvedValue(mockUpdatedTopic);

      const result = await service.update(topicId, updateTopicDto);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { slug: slugify(updateTopicDto.title) },
      });
      expect(mockPrismaService.topic.update).toHaveBeenCalledWith({
        where: { id: topicId },
        data: {
          ...updateTopicDto,
          slug: slugify(updateTopicDto.title),
        },
      });
      expect(result).toEqual(mockUpdatedTopic);
    });

    it('should throw ConflictException if a topic with the same slug exists and has a different ID', async () => {
      const conflictingTopic = topicEntityMock({
        id: 'different-id',
      });
      mockPrismaService.topic.findUnique.mockResolvedValue(conflictingTopic);

      await expect(service.update(topicId, updateTopicDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { slug: slugify(updateTopicDto.title) },
      });
      expect(mockPrismaService.topic.update).not.toHaveBeenCalled();
    });

    it('should update the topic if a topic with the same slug exists but has the same ID', async () => {
      const existingTopic = topicEntityMock({ id: topicId });
      mockPrismaService.topic.findUnique.mockResolvedValue(existingTopic);
      mockPrismaService.topic.update.mockResolvedValue(mockUpdatedTopic);

      const result = await service.update(topicId, updateTopicDto);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { slug: slugify(updateTopicDto.title) },
      });
      expect(mockPrismaService.topic.update).toHaveBeenCalledWith({
        where: { id: topicId },
        data: {
          ...updateTopicDto,
          slug: slugify(updateTopicDto.title),
        },
      });
      expect(result).toEqual(mockUpdatedTopic);
    });
  });

  describe('findAllByUserId', () => {
    const userId = 'mock-user-id';
    const mockTopics: Topic[] = [
      topicEntityMock({
        id: 'topic-id-1',
        title: 'Topic 1',
        slug: 'topic-1',
        createdById: userId,
      }),
      topicEntityMock({
        id: 'topic-id-2',
        title: 'Topic 2',
        slug: 'topic-2',
        createdById: userId,
      }),
    ];

    it('should return all topics created by the specified user', async () => {
      mockPrismaService.topic.findMany.mockResolvedValue(mockTopics);

      const result = await service.findAllByUserId(userId);

      expect(mockPrismaService.topic.findMany).toHaveBeenCalledWith({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTopics);
    });

    it('should return an empty array if the user has no topics', async () => {
      mockPrismaService.topic.findMany.mockResolvedValue([]);

      const result = await service.findAllByUserId(userId);

      expect(mockPrismaService.topic.findMany).toHaveBeenCalledWith({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([]);
    });
  });
});
