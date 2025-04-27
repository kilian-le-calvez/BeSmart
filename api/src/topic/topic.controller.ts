import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('topics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Body() createTopicDto: CreateTopicDto, @CurrentUser() user: User) {
    return this.topicService.create(user.id, createTopicDto);
  }

  @Get()
  findAll() {
    return this.topicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
    @CurrentUser() user: User,
  ) {
    // Check if the user is the owner of the topic
    const topic = await this.topicService.findOne(id);
    if (topic.createdById !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to modify this topic',
      );
    }

    return this.topicService.update(id, updateTopicDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    // Check if the user is the owner of the topic
    const topic = await this.topicService.findOne(id);
    if (topic.createdById !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this topic',
      );
    }
    return this.topicService.remove(id);
  }
}
