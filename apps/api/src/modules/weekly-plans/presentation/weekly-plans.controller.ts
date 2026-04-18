import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '@/modules/auth/infrastructure/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/jwt-auth.guard';
import { WeeklyPlansService } from '../application/weekly-plans.service';
import { GenerateWeeklyPlanDto } from './dto/generate-weekly-plan.dto';

@ApiTags('weekly-plans')
@Controller('weekly-plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WeeklyPlansController {
  constructor(private readonly weeklyPlansService: WeeklyPlansService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate a weekly plan from a planning request' })
  async generate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateWeeklyPlanDto,
  ) {
    return this.weeklyPlansService.generate(user.id, dto);
  }
}
