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
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserRequest,
} from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';

@ApiTags('contributions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post()
  create(
    @Body() createContributionDto: CreateContributionDto,
    @CurrentUser() user: CurrentUserRequest,
  ) {
    return this.contributionService.create(createContributionDto, user.id);
  }

  @Get('thread/:threadId')
  findByThread(@Param('threadId') threadId: string) {
    return this.contributionService.findByThread(threadId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContributionDto: UpdateContributionDto,
    @CurrentUser() user: CurrentUserRequest,
  ) {
    return this.contributionService.update(id, updateContributionDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserRequest) {
    return this.contributionService.remove(id, user.id);
  }
}
