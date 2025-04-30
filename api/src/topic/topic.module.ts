import { Module } from '@nestjs/common';
import { TopicService } from './service/topic.service';
import { TopicController } from './controller/topic.controller';
import { PrismaModule } from '@prisma-api/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
