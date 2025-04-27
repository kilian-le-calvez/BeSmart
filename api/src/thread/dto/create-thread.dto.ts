// create-thread.dto.ts
import { ThreadCategory } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
} from 'class-validator';

export class CreateThreadDto {
  @IsString()
  title: string;

  @IsString()
  starterMessage: string;

  @IsString()
  topicId: string;

  @IsString()
  createdById: string;

  @IsOptional()
  @IsInt()
  viewsCount?: number;

  @IsOptional()
  @IsInt()
  repliesCount?: number;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

  @IsOptional()
  @IsEnum(ThreadCategory)
  category?: ThreadCategory;
}
