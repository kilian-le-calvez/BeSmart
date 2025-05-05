import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma-api/prisma.service';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { slugify } from '@common/helpers/slugify';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { Topic } from '@prisma/client';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new topic with the given data and associates it with the specified user.
   *
   * @param userId - The ID of the user creating the topic.
   * @param dto - The data transfer object containing the details of the topic to be created.
   * @returns A promise that resolves to the created `Topic` object.
   * @throws ConflictException - If a topic with the same title (slug) already exists.
   */
  async create(userId: string, dto: CreateTopicDto): Promise<Topic> {
    const slug = slugify(dto.title);

    const existing = await this.prisma.topic.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(
        'A topic with the same title already exists.',
      );
    }

    return this.prisma.topic.create({
      data: {
        ...dto,
        slug,
        createdById: userId,
      },
    });
  }

  /**
   * Retrieves all topics from the database.
   *
   * @returns A promise that resolves to an array of topics.
   */
  async findAll(): Promise<Topic[]> {
    return this.prisma.topic.findMany();
  }

  /**
   * Retrieves all topics created by a specific user.
   *
   * @param userId - The ID of the user whose topics to retrieve.
   * @returns A promise that resolves to an array of topics created by the specified user.
   */
  async findAllByUserId(userId: string): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single topic by its unique identifier.
   *
   * @param id - The unique identifier of the topic to retrieve.
   * @returns A promise that resolves to the topic object if found, or `null` if no topic exists with the given ID.
   */
  async findOne(id: string): Promise<Topic> {
    const topicFound = await this.prisma.topic.findUnique({ where: { id } });
    if (!topicFound) {
      throw new NotFoundException('Topic not found');
    }
    return topicFound;
  }

  /**
   * Updates an existing topic with the provided data.
   *
   * @param id - The unique identifier of the topic to update.
   * @param dto - The data transfer object containing the updated topic details.
   *
   * @throws {ConflictException} If a topic with the same title (slug) already exists.
   *
   * @returns A promise that resolves to the updated topic.
   */
  async update(id: string, dto: UpdateTopicDto): Promise<Topic> {
    const slug = slugify(dto.title);
    const existing = await this.prisma.topic.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      throw new ConflictException(
        'A topic with the same title already exists.',
      );
    }
    return this.prisma.topic.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
  }

  /**
   * Deletes a topic by its unique identifier.
   *
   * @param id - The unique identifier of the topic to be deleted.
   * @returns The title of the deleted topic.
   * @throws NotFoundException - If no topic is found with the given identifier.
   */
  async delete(id: string): Promise<string> {
    const topicFound = await this.prisma.topic.findUnique({ where: { id } });
    if (!topicFound) {
      throw new NotFoundException('Topic not found');
    }
    return (await this.prisma.topic.delete({ where: { id } })).title;
  }

  /**
   * Checks if the given user is the owner of the specified topic.
   *
   * @param userId - The ID of the user to check ownership for.
   * @param topicId - The ID of the topic to verify ownership against.
   * @returns A promise that resolves to `true` if the user is the owner of the topic, otherwise `false`.
   * @throws NotFoundException - If the topic with the specified ID does not exist.
   */
  public async isOwner(userId: string, topicId: string): Promise<boolean> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { createdById: true },
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    return topic?.createdById === userId;
  }

  /**
   * Ensures that the user is the owner of the specified topic.
   * If the user is not the owner, a `ForbiddenException` is thrown.
   *
   * @param userId - The ID of the user to check ownership for.
   * @param topicId - The ID of the topic to verify ownership against.
   * @throws {ForbiddenException} If the user is not the owner of the topic.
   * @returns A promise that resolves to void if the user is the owner.
   */
  async unauthorizedOwner(userId: string, topicId: string): Promise<void> {
    const isOwner = await this.isOwner(userId, topicId);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this topic');
    }
  }
}
