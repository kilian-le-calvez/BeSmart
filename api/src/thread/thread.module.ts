import { Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { PrismaModule } from '@prisma-api/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
