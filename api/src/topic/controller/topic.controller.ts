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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { MessageResponse } from '@common/response/message.response';
import { BaseResponse } from '@common/response/base.response';
import { TopicService } from '@topic/service/topic.service';
import { CreateTopicDto } from '@topic/dto/create-topic.dto';
import { TopicResponse } from '@topic/topic.response';
import { UpdateTopicDto } from '@topic/dto/update-topic.dto';
import {
  TopicCreateSwagger,
  TopicDeleteSwagger,
  TopicFindAllSwagger,
  TopicFindOneSwagger,
  TopicUpdateSwagger,
} from './topic.swagger';
import { JWTUnauthorizedSwagger } from '@common/swagger/jwt-unauthorized.swagger';

@ApiTags('topics')
@JWTUnauthorizedSwagger()
@UseGuards(JwtAuthGuard)
@Controller('topics')
/**
 * @throws {UnauthorizedException} If the user is not authenticated.
 */
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @TopicCreateSwagger()
  /**
   * Creates a new topic using the provided data and the current user.
   *
   * @param createTopicDto - The data transfer object containing the details of the topic to be created.
   * @param user - The currently authenticated user initiating the topic creation.
   * @returns A promise that resolves to a `BaseResponse` containing the created topic's details.
   *
   * @throws {ConflictException} If topic with same title exists.
   */
  async create(
    @Body() createTopicDto: CreateTopicDto,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<TopicResponse>> {
    const topicCreated = await this.topicService.create(
      user.id,
      createTopicDto,
    );
    return {
      message: 'Topic created successfully',
      data: topicCreated,
    };
  }

  @Get()
  @TopicFindAllSwagger()
  /**
   * Retrieves all topics.
   *
   * @returns A promise that resolves to an array of topics.
   */
  async findAll(): Promise<BaseResponse<TopicResponse[]>> {
    const listTopics = await this.topicService.findAll();
    return {
      message: 'List of topics',
      data: listTopics,
    };
  }

  @Get(':id')
  @TopicFindOneSwagger()
  /**
   * Retrieves a single topic by its unique identifier.
   *
   * @param id - The unique identifier of the topic to retrieve.
   * @returns A promise that resolves to the topic's response object.
   */
  async findOne(@Param('id') id: string): Promise<BaseResponse<TopicResponse>> {
    const topicFound = await this.topicService.findOne(id);
    return {
      message: 'Topic found',
      data: topicFound,
    };
  }

  @Patch(':id')
  @TopicUpdateSwagger()
  /**
   * Updates an existing topic with the provided data.
   *
   * @param id - The unique identifier of the topic to update.
   * @param updateTopicDto - The data transfer object containing the updated topic information.
   * @param user - The currently authenticated user making the request.
   * @returns A promise that resolves to a `BaseResponse` containing the updated topic information.
   * @throws UnauthorizedException - If the user is not the owner of the topic.
   */
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<TopicResponse>> {
    // Check if the user is the owner of the topic
    await this.topicService.unauthorizedOwner(user.id, id);

    const topicUpdated = await this.topicService.update(id, updateTopicDto);
    return {
      message: `Topic "${topicUpdated.title}" updated successfully`,
      data: topicUpdated,
    };
  }

  @Delete(':id')
  @TopicDeleteSwagger()
  /**
   * Deletes a topic by its ID after verifying the user's ownership.
   *
   * @param id - The ID of the topic to be deleted.
   * @param user - The currently authenticated user.
   * @returns A promise that resolves to a message response indicating the topic was deleted successfully.
   * @throws UnauthorizedException - If the user is not the owner of the topic.
   */
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MessageResponse> {
    // Check if the user is the owner of the topic
    await this.topicService.unauthorizedOwner(user.id, id);
    console.log('user.id', user.id);

    const titleTopicDeleted = await this.topicService.delete(id);
    return {
      message: `Topic "${titleTopicDeleted}" deleted successfully`,
    };
  }
}
