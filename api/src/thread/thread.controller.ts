import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';
import { User } from '@prisma/client';
import { ThreadResponse } from './thread.response';
import { BaseResponse } from '@common/response/base.response';
import { MessageResponse } from '@common/response/message.response';

@ApiTags('threads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  async create(
    @Body() createThreadDto: CreateThreadDto,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<ThreadResponse>> {
    const threadCreate = await this.threadService.create(createThreadDto, user);
    return {
      message: 'Thread created successfully',
      data: threadCreate,
    };
  }

  @Get('topic/:topicId')
  async findByTopic(
    @Param('topicId') topicId: string,
  ): Promise<BaseResponse<ThreadResponse[]>> {
    const listThreadFound = await this.threadService.findByTopic(topicId);
    return {
      message: 'Threads found',
      data: listThreadFound,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponse<ThreadResponse>> {
    const threadFound = await this.threadService.findOne(id);

    return {
      message: 'Thread found',
      data: threadFound,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDto,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<ThreadResponse>> {
    const threadUpdated = await this.threadService.update(
      id,
      updateThreadDto,
      user,
    );
    return {
      message: 'Thread updated successfully',
      data: threadUpdated,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MessageResponse> {
    const threadDeleted = await this.threadService.remove(id, user);
    return {
      message: 'Thread deleted successfully: ' + threadDeleted.title,
    };
  }
}
