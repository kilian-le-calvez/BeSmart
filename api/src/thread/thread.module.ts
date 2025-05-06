import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-api/prisma.module';
import { ThreadController } from './controller/thread.controller';
import { ThreadService } from './service/thread.service';

@Module({
  imports: [PrismaModule],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
