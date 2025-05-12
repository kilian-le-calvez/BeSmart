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
  /**
   * Retrieves a single thread by its ID.
   *
   * @param id - The unique identifier of the thread to retrieve.
   * @returns A promise that resolves to a `BaseResponse` containing the thread data.
   * @throws Will throw an error if the thread is not found or if an issue occurs during retrieval.
   */
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
  /**
   * Updates an existing thread with the provided data.
   *
   * @param id - The unique identifier of the thread to update.
   * @param updateThreadDto - The data transfer object containing the updated thread details.
   * @param user - The current user making the request, used to verify ownership or permissions.
   * @returns A promise that resolves to a `BaseResponse` containing the updated thread details.
   *
   * @throws {NotFoundException} If the thread with the given ID does not exist.
   * @throws {ForbiddenException} If the user does not have permission to update the thread.
   */
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
  /**
   * Deletes a thread by its ID and returns a success message.
   *
   * @param id - The ID of the thread to be deleted.
   * @param user - The current user making the request, containing user details.
   * @returns A promise that resolves to a message response indicating the thread was deleted successfully.
   * @throws Will throw an error if the thread cannot be deleted or if the user lacks permissions.
   */
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
