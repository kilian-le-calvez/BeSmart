import { ApiProperty } from '@nestjs/swagger';
import { ThreadCategory } from '@prisma/client';

export class ThreadResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  id: string;

  @ApiProperty({ example: '2025-05-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-02T12:30:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'Why learning culture matters' })
  title: string;

  @ApiProperty({
    example: "Let's talk about why culture is essential to long-term growth...",
  })
  starterMessage: string;

  @ApiProperty({ example: 'topic-uuid-1234' })
  topicId: string;

  @ApiProperty({ example: 'user-uuid-5678' })
  createdById: string;

  @ApiProperty({ example: 128 })
  viewsCount: number;

  @ApiProperty({ example: 15 })
  repliesCount: number;

  @ApiProperty({ example: true })
  pinned: boolean;

  @ApiProperty({ enum: ThreadCategory, example: ThreadCategory.QUESTION })
  category: ThreadCategory;
}
