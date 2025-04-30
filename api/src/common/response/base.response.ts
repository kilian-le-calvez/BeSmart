// src/common/dto/base-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MessageResponse } from './message.response';

export class BaseResponse<T> extends MessageResponse {
  @ApiProperty({ description: 'Payload data of the response' })
  data: T;
}
