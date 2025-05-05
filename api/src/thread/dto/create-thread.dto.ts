// create-thread.dto.ts
import { ThreadCategory } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty({ example: 'How to learn faster?' })
  @IsString()
  title: string;

  @ApiProperty({ example: "I'm looking for tips to boost my learning speed." })
  @IsString()
  starterMessage: string;

  @ApiProperty({ example: 'topic-uuid-1234' })
  @IsString()
  topicId: string;

  @ApiPropertyOptional({
    enum: ThreadCategory,
    example: ThreadCategory.QUESTION,
  })
  @IsEnum(ThreadCategory)
  category: ThreadCategory;
}
