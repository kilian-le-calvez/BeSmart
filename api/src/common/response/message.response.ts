import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({
    description: 'Informative message about the response',
    example: 'Success',
  })
  message: string;
}

export class ErrorResponse extends MessageResponse {
  @ApiProperty({
    description: 'Informative message about the response',
    example: 'Error',
  })
  message: string;

  @ApiProperty({
    description: 'Error message detailing the issue',
    example: 'An error occurred',
  })
  error: string;

  @ApiProperty({
    description: 'Status code about the error',
    example: '400',
  })
  statusCode: string;
}

export class NotFoundResponse extends ErrorResponse {
  @ApiProperty({
    description: 'Error message detailing the issue',
    example: 'Resource not found',
  })
  error: string;

  @ApiProperty({
    description: 'Status code about the error',
    example: '404',
  })
  statusCode: string;
}

export class ForbiddenResponse extends ErrorResponse {
  @ApiProperty({
    description: 'Error message detailing the issue',
    example: 'Forbidden',
  })
  error: string;

  @ApiProperty({
    description: 'Status code about the error',
    example: '403',
  })
  statusCode: string;
}
