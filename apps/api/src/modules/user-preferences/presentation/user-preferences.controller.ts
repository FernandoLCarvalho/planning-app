import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '@/modules/auth/infrastructure/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/jwt-auth.guard';
import { UserPreferencesService } from '../application/user-preferences.service';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';

@ApiTags('users')
@Controller('users/me/preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get user preferences (creates defaults on first access)',
  })
  async getPreferences(@CurrentUser() user: AuthenticatedUser) {
    return this.userPreferencesService.getOrCreate(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update user preferences' })
  async updatePreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserPreferencesDto,
  ) {
    return this.userPreferencesService.update(user.id, dto);
  }
}
