import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-api/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { slugify } from '@common/helpers/slugify';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, dto: CreateTopicDto) {
    const slug = slugify(dto.title);
    return this.prisma.topic.create({
      data: {
        ...dto,
        createdById: id,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.topic.findMany();
  }

  async findOne(id: string) {
    return this.prisma.topic.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateTopicDto) {
    return this.prisma.topic.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.topic.delete({ where: { id } });
  }
}
