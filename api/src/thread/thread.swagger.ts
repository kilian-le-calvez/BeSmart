import {
  ForbiddenResponse,
  MessageResponse,
  NotFoundResponse,
} from '@common/response/message.response';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ThreadResponse } from './thread.response';

type ApplyDecorators = ReturnType<typeof applyDecorators>;

export function ThreadCreateSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new Thread' }),
    ApiResponse({
      status: 201,
      description: 'Thread created successfully',
      type: ThreadResponse,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Thread with the same slug already exists',
    }),
  );
}

export function ThreadFindAllSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all threads' }),
    ApiResponse({
      status: 200,
      description: 'List of threads',
      type: [ThreadResponse],
    }),
  );
}

export function ThreadFindAllMeSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get all connected user threads' }),
    ApiResponse({
      status: 200,
      description: 'List of threads',
      type: [ThreadResponse],
    }),
  );
}

export function ThreadFindOneSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Get a Thread by ID' }),
    ApiParam({ name: 'id', description: 'Thread ID' }),
    ApiResponse({
      status: 200,
      description: 'Thread found',
      type: ThreadResponse,
    }),
    ApiResponse({
      status: 404,
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
    ApiResponse({
      status: 403,
      description: 'You are not the owner of this Thread',
      type: ForbiddenResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Thread not found',
      type: NotFoundResponse,
    }),
  );
}

export function ThreadDeleteSwagger(): ApplyDecorators {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a Thread (only by owner)' }),
    ApiParam({ name: 'id', description: 'Thread ID' }),
    ApiResponse({
      status: 200,
      description: 'Thread deleted',
      type: MessageResponse,
    }),
    ApiResponse({
      status: 403,
      description: 'You are not the owner of this Thread',
      type: ForbiddenResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Thread not found',
      type: NotFoundResponse,
    }),
  );
}
