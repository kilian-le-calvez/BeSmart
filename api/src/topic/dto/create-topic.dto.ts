import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({
    description: 'Title of the topic',
    example: 'The Philosophy of Stoicism',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the topic',
    example:
      'An exploration of ancient Stoic principles and their modern relevance.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'List of tags associated with the topic',
    type: [String],
    example: ['philosophy', 'stoicism', 'ethics'],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
