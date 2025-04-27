import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  threadId: string;

  @IsUUID()
  @IsOptional()
  parentContributionId?: string; // for replying to another contribution
}
