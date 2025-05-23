import {
  ForbiddenResponse,
  MessageResponse,
  NotFoundResponse,
} from '@common/response/message.response';
import ApplyDecorators from '@common/swagger/apply-decorator.types';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TopicResponse } from '@topic/topic.response';

export function TopicCreateSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new topic' }),
    ApiResponse({
      status: 201,
      description: 'Topic created successfully',
      type: TopicResponse,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - topic with the same slug already exists',
    }),
  );
}

export function TopicFindAllSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all topics' }),
    ApiResponse({
      status: 200,
      description: 'List of topics',
      type: [TopicResponse],
    }),
  );
}

export function TopicFindAllMeSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all connected user topics' }),
    ApiResponse({
      status: 200,
      description: 'List of topics',
      type: [TopicResponse],
    }),
  );
}

export function TopicFindOneSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get a topic by ID' }),
    ApiParam({ name: 'id', description: 'Topic ID' }),
    ApiResponse({
      status: 200,
      description: 'Topic found',
      type: TopicResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Topic not found',
      type: NotFoundResponse,
    }),
  );
}

export function TopicUpdateSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Update a topic (only by owner)' }),
    ApiParam({ name: 'id', description: 'Topic ID' }),
    ApiResponse({
      status: 200,
      description: 'Topic updated',
      type: MessageResponse,
    }),
    ApiResponse({
      status: 403,
      description: 'You are not the owner of this topic',
      type: ForbiddenResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Topic not found',
      type: NotFoundResponse,
    }),
  );
}

export function TopicDeleteSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a topic (only by owner)' }),
    ApiParam({ name: 'id', description: 'Topic ID' }),
    ApiResponse({
      status: 200,
      description: 'Topic deleted',
      type: MessageResponse,
    }),
    ApiResponse({
      status: 403,
      description: 'You are not the owner of this topic',
      type: ForbiddenResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Topic not found',
      type: NotFoundResponse,
    }),
  );
}
