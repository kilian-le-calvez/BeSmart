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
import {
  CurrentUser,
  CurrentUserRequest,
} from '@common/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';
import { BaseResponse } from '@common/response/base.response';
import { MessageResponse } from '@common/response/message.response';
import { JWTUnauthorizedSwagger } from '@common/swagger/jwt-unauthorized.swagger';
import { ThreadService } from '@thread/service/thread.service';
import { ThreadResponse } from '@thread/response/thread.response';
import {
  ThreadCreateSwagger,
  ThreadFindByTopicSwagger,
} from '@thread/thread.swagger';
import { CreateThreadDto } from '@thread/dto/create-thread.dto';
import { UpdateThreadDto } from '@thread/dto/update-thread.dto';

@ApiTags('threads')
@JWTUnauthorizedSwagger()
@UseGuards(JwtAuthGuard)
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  @ThreadCreateSwagger()
  /**
   * Creates a new thread using the provided data and the current user.
   *
   * @param createThreadDto - The data transfer object containing the details for the new thread.
   * @param user - The currently authenticated user creating the thread.
   * @returns A promise that resolves to a base response containing the created thread details.
   */
  async create(
    @Body() createThreadDto: CreateThreadDto,
    @CurrentUser() user: CurrentUserRequest,
  ): Promise<BaseResponse<ThreadResponse>> {
    const threadCreate = await this.threadService.create(
      createThreadDto,
      user.id,
    );
    return {
      message: 'Thread created successfully',
      data: threadCreate,
    };
  }

  @Get('by-topic/:topicId')
  @ThreadFindByTopicSwagger()
  /**
   * Retrieves a list of threads associated with a specific topic.
   *
   * @param topicId - The unique identifier of the topic for which threads are to be retrieved.
   * @returns A promise that resolves to a `BaseResponse` containing an array of `ThreadResponse` objects.
   *          The response includes a message indicating the operation's success and the data containing the threads.
   */
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
    @CurrentUser() user: CurrentUserRequest,
  ): Promise<BaseResponse<ThreadResponse>> {
    const threadUpdated = await this.threadService.update(
      id,
      updateThreadDto,
      user.id,
    );
    return {
      message: 'Thread updated successfully',
      data: threadUpdated,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserRequest,
  ): Promise<MessageResponse> {
    const threadDeleted = await this.threadService.remove(id, user.id);
    return {
      message: 'Thread deleted successfully: ' + threadDeleted.title,
    };
  }
}
