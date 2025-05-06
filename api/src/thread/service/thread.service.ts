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

  async findOne(id: string): Promise<ThreadResponse> {
    const thread = await this.prisma.thread.findUnique({ where: { id } });
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

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
