import { Topic } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TopicResponse {
  @ApiProperty({ description: 'Unique identifier for the topic' })
  id: string;

  @ApiProperty({ description: 'Timestamp when the topic was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the topic was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'URL-friendly slug for the topic' })
  slug: string;

  @ApiProperty({ description: 'Title of the topic' })
  title: string;

  @ApiProperty({ description: 'Detailed description of the topic' })
  description: string;

  @ApiProperty({
    type: [String],
    description: 'Tags associated with the topic',
  })
  tags: string[];

  @ApiProperty({ description: 'ID of the user who created the topic' })
  createdById: string;

  @ApiProperty({
    enum: ['PUBLIC', 'PRIVATE'],
    description: 'Visibility status of the topic',
  })
  visibility: Topic['visibility'];
}
