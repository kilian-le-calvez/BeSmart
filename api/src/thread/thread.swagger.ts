import {
  ForbiddenResponse,
  MessageResponse,
  NotFoundResponse,
} from '@common/response/message.response';
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ThreadResponse } from './response/thread.response';
import { BaseResponse } from '@common/response/base.response';
import ApplyDecorators from '@common/swagger/apply-decorator.types';
import { ApiBaseResponse } from '@common/swagger/swagger-generic-response.decorator';

export function ThreadCreateSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new Thread' }),
    ApiExtraModels(BaseResponse, ThreadResponse),
    ApiBaseResponse(ThreadResponse, {
      status: 201,
      description: 'Thread created successfully',
    }),
    ApiNotFoundResponse({
      description: 'Topic not found',
      type: NotFoundResponse,
    }),
  );
}

export function ThreadFindByTopicSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all threads for a given topic' }),
    ApiBaseResponse(ThreadResponse, {
      isArray: true,
      status: 200,
      description: 'List of threads for a given topic',
    }),
    ApiNotFoundResponse({
      description: 'Topic not found',
      type: NotFoundResponse,
    }),
  );
}

export function ThreadFindAllSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all threads' }),
    ApiBaseResponse(ThreadResponse, {
      isArray: true,
      status: 200,
      description: 'List of threads',
    }),
  );
}

export function ThreadFindAllMeSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all connected user threads' }),
    ApiBaseResponse(ThreadResponse, {
      isArray: true,
      status: 200,
      description: 'List of threads',
    }),
  );
}

export function ThreadFindOneSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get a Thread by ID' }),
    ApiParam({ name: 'id', description: 'Thread ID' }),
    ApiBaseResponse(ThreadResponse, {
      status: 200,
      description: 'Thread found',
    }),
    ApiNotFoundResponse({
      description: 'Thread not found',
      type: NotFoundResponse,
    }),
  );
}

export function ThreadUpdateSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Update a Thread (only by owner)' }),
    ApiParam({ name: 'id', description: 'Thread ID' }),
    ApiResponse({
      status: 200,
      description: 'Thread updated',
      type: MessageResponse,
    }),
    ApiForbiddenResponse({
      description: 'You are not the owner of this Thread',
      type: ForbiddenResponse,
    }),
    ApiNotFoundResponse({
      description: 'Thread not found',
      type: NotFoundResponse,
    }),
  );
}

export function ThreadDeleteSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a Thread (only by owner)' }),
    ApiParam({ name: 'id', description: 'Thread ID' }),
    ApiOkResponse({
      description: 'Thread deleted',
      type: MessageResponse,
    }),
    ApiForbiddenResponse({
      description: 'You are not the owner of this Thread',
      type: ForbiddenResponse,
    }),
    ApiNotFoundResponse({
      description: 'Thread not found',
      type: NotFoundResponse,
    }),
  );
}
