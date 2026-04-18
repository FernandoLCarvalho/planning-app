import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '@/modules/auth/infrastructure/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/jwt-auth.guard';
import { WeeklyPlanningRequestsService } from '../application/weekly-planning-requests.service';
import { CreateWeeklyPlanningRequestDto } from './dto/create-weekly-planning-request.dto';
import { UpdateWeeklyPlanningRequestDto } from './dto/update-weekly-planning-request.dto';

@ApiTags('weekly-planning-requests')
@Controller('weekly-planning-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WeeklyPlanningRequestsController {
  constructor(
    private readonly weeklyPlanningRequestsService: WeeklyPlanningRequestsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a weekly planning request' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWeeklyPlanningRequestDto,
  ) {
    return this.weeklyPlanningRequestsService.create(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a weekly planning request by id' })
  async findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.weeklyPlanningRequestsService.findById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a weekly planning request' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateWeeklyPlanningRequestDto,
  ) {
    return this.weeklyPlanningRequestsService.update(id, user.id, dto);
  }
}
