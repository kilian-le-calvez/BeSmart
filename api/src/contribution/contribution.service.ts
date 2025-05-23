import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { PrismaService } from '@prisma-api/prisma.service';

@Injectable()
export class ContributionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContributionDto: CreateContributionDto, userId: string) {
    // Check thread exists
    const thread = await this.prisma.thread.findUnique({
      where: { id: createContributionDto.threadId },
    });
    if (!thread) throw new NotFoundException('Thread not found');

    return this.prisma.contribution.create({
      data: {
        content: createContributionDto.content,
        createdById: userId,
        threadId: createContributionDto.threadId,
        parentContributionId:
          createContributionDto.parentContributionId ?? null,
      },
    });
  }

  async findByThread(threadId: string) {
    return this.prisma.contribution.findMany({
      where: { threadId, parentContributionId: null },
      include: {
        replies: {
          include: {
            createdBy: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        createdBy: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution not found');
    return contribution;
  }

  async update(
    id: string,
    updateContributionDto: UpdateContributionDto,
    userId: string,
  ) {
    const contribution = await this.findOne(id);
    if (contribution.createdById !== userId) {
      throw new ForbiddenException('You can only edit your own contribution.');
    }

    return this.prisma.contribution.update({
      where: { id },
      data: updateContributionDto,
    });
  }

  async remove(id: string, userId: string) {
    const contribution = await this.findOne(id);
    if (contribution.createdById !== userId) {
      throw new ForbiddenException(
        'You can only delete your own contribution.',
      );
    }

    return this.prisma.contribution.delete({
      where: { id },
    });
  }
}
