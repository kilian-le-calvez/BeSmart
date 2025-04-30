import { Module } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { PrismaModule } from '@prisma-api/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContributionController],
  providers: [ContributionService],
})
export class ContributionModule {}
