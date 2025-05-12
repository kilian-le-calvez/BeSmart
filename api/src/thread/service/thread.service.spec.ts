import { Test, TestingModule } from '@nestjs/testing';
import { ThreadService } from './thread.service';
import { PrismaService } from '@prisma-api/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateThreadDto } from '@thread/dto/create-thread.dto';
import getMockPrismaService, {
  MockPrismaService,
} from '@tests/mock-prisma-service';

describe('ThreadService', () => {
  let service: ThreadService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadService,
        {
          provide: PrismaService,
          useValue: getMockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<ThreadService>(ThreadService);
    prisma = module.get<MockPrismaService>(PrismaService);
  });

  describe('create', () => {
    const createThreadDto: CreateThreadDto = {
      title: 'Test Thread',
      starterMessage: 'This is a test thread',
      topicId: 'topic-id',
      category: 'DISCUSSION',
    };
    const userId = 'user-id';

    it('should create a thread successfully', async () => {
      prisma.topic.findUnique.mockResolvedValue({ id: 'topic-id' });
      prisma.thread.findUnique.mockResolvedValue(null);
      prisma.thread.create.mockResolvedValue({
        id: 'thread-id',
        ...createThreadDto,
        slug: 'test-thread',
        createdById: userId,
        viewsCount: 0,
        repliesCount: 0,
        pinned: false,
      });

      const result = await service.create(createThreadDto, userId);

      expect(prisma.topic.findUnique).toHaveBeenCalledWith({
        where: { id: createThreadDto.topicId },
      });
      expect(prisma.thread.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-thread' },
      });
      expect(prisma.thread.create).toHaveBeenCalledWith({
        data: {
          slug: 'test-thread',
          title: createThreadDto.title,
          starterMessage: createThreadDto.starterMessage,
          createdById: userId,
          topicId: createThreadDto.topicId,
          viewsCount: 0,
          repliesCount: 0,
          pinned: false,
          category: createThreadDto.category,
        },
      });
      expect(result).toEqual({
        id: 'thread-id',
        ...createThreadDto,
        slug: 'test-thread',
        createdById: userId,
        viewsCount: 0,
        repliesCount: 0,
        pinned: false,
      });
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      prisma.topic.findUnique.mockResolvedValue(null);

      await expect(service.create(createThreadDto, userId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.topic.findUnique).toHaveBeenCalledWith({
        where: { id: createThreadDto.topicId },
      });
      expect(prisma.thread.create).not.toHaveBeenCalled();
    });

    it('should generate a unique slug if a conflict exists', async () => {
      prisma.topic.findUnique.mockResolvedValue({ id: 'topic-id' });
      prisma.thread.findUnique = jest
        .fn()
        .mockResolvedValueOnce({ slug: 'test-thread' }) // First call returns existing slug
        .mockResolvedValueOnce(null); // Second call returns null
      prisma.thread.create.mockResolvedValue({
        id: 'thread-id',
        ...createThreadDto,
        slug: 'test-thread-1',
        createdById: userId,
        viewsCount: 0,
        repliesCount: 0,
        pinned: false,
      });

      const result = await service.create(createThreadDto, userId);

      expect(prisma.thread.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-thread' },
      });
      expect(prisma.thread.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-thread-1' },
      });
      expect(prisma.thread.create).toHaveBeenCalledWith({
        data: {
          slug: 'test-thread-1',
          title: createThreadDto.title,
          starterMessage: createThreadDto.starterMessage,
          createdById: userId,
          topicId: createThreadDto.topicId,
          viewsCount: 0,
          repliesCount: 0,
          pinned: false,
          category: createThreadDto.category,
        },
      });
      expect(result).toEqual({
        id: 'thread-id',
        ...createThreadDto,
        slug: 'test-thread-1',
        createdById: userId,
        viewsCount: 0,
        repliesCount: 0,
        pinned: false,
      });
    });
  });
});
