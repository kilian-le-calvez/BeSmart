import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('threads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  create(@Body() createThreadDto: CreateThreadDto, @CurrentUser() user: User) {
    return this.threadService.create(createThreadDto, user);
  }

  @Get('topic/:topicId')
  findByTopic(@Param('topicId') topicId: string) {
    return this.threadService.findByTopic(topicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDto,
    @CurrentUser() user: User,
  ) {
    return this.threadService.update(id, updateThreadDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.threadService.remove(id, user);
  }
}
