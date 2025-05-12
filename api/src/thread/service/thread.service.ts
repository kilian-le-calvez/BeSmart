import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@prisma-api/prisma.service';
import { slugify } from '@common/helpers/slugify';
import { ThreadResponse } from '@thread/response/thread.response';
import { CreateThreadDto } from '@thread/dto/create-thread.dto';
import { UpdateThreadDto } from '@thread/dto/update-thread.dto';

@Injectable()
export class ThreadService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new thread in the specified topic.
   *
   * This method validates the existence of the topic associated with the thread,
   * generates a unique slug for the thread based on its title, and then creates
   * the thread in the database with the provided details.
   *
   * @param createThreadDto - The data transfer object containing the details
   * of the thread to be created, including title, starter message, topic ID, and category.
   * @param userId - The ID of the user creating the thread.
   * @returns A promise that resolves to the created thread's response object.
   * @throws NotFoundException - If the specified topic does not exist.
   */
  async create(
    createThreadDto: CreateThreadDto,
    userId: string,
  ): Promise<ThreadResponse> {
    // Check topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: createThreadDto.topicId },
    });
    if (!topic) throw new NotFoundException('Topic not found');

    const baseSlug = slugify(createThreadDto.title);
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slugs and increment if necessary
    while (await this.prisma.thread.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return this.prisma.thread.create({
      data: {
        slug,
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
  }

  /**
   * Retrieves a list of threads associated with a specific topic.
   *
   * @param topicId - The unique identifier of the topic.
   * @returns A promise that resolves to an array of `ThreadResponse` objects.
   * @throws NotFoundException - If the topic with the given ID does not exist.
   */
  async findByTopic(topicId: string): Promise<ThreadResponse[]> {
    // Check topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic) throw new NotFoundException('Topic not found');

    // Fetch threads for the topic
    return this.prisma.thread.findMany({
      where: { topicId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single thread by its unique identifier.
   *
   * @param id - The unique identifier of the thread to retrieve.
   * @returns A promise that resolves to the thread data if found.
   * @throws NotFoundException - If no thread is found with the given identifier.
   */
  async findOne(id: string): Promise<ThreadResponse> {
    const thread = await this.prisma.thread.findUnique({ where: { id } });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  /**
   * Updates an existing thread with the provided data.
   *
   * @param id - The unique identifier of the thread to update.
   * @param updateThreadDto - The data transfer object containing the updated thread information.
   * @param userId - The unique identifier of the user attempting to update the thread.
   * @returns A promise that resolves to the updated thread response.
   * @throws {ForbiddenException} If the user is not the creator of the thread.
   */
  async update(
    id: string,
    updateThreadDto: UpdateThreadDto,
    userId: string,
  ): Promise<ThreadResponse> {
    const thread = await this.findOne(id);
    if (thread.createdById !== userId) {
      throw new ForbiddenException('You can only edit your own thread.');
    }

    return this.prisma.thread.update({
      where: { id },
      data: updateThreadDto,
    });
  }

  /**
   * Removes a thread by its ID if the requesting user is the creator of the thread.
   *
   * @param id - The unique identifier of the thread to be removed.
   * @param userId - The unique identifier of the user attempting to delete the thread.
   * @returns A promise that resolves to the deleted thread's response object.
   * @throws {ForbiddenException} If the requesting user is not the creator of the thread.
   */
  async remove(id: string, userId: string): Promise<ThreadResponse> {
    const thread = await this.findOne(id);
    if (thread.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own thread.');
    }

    return this.prisma.thread.delete({
      where: { id },
    });
  }
}
