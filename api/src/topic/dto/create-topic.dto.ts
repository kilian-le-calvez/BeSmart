import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
