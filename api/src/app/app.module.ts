import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma-api/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { TopicModule } from '@topic/topic.module';
import { ThreadModule } from '@thread/thread.module';
import { ContributionModule } from '@contribution/contribution.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    TopicModule,
    ThreadModule,
    ContributionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
