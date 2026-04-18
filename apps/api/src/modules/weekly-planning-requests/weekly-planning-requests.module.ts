import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { WeeklyPlanningRequestsService } from './application/weekly-planning-requests.service';
import { WeeklyPlanningRequestsController } from './presentation/weekly-planning-requests.controller';

@Module({
  imports: [AuthModule],
  providers: [WeeklyPlanningRequestsService],
  controllers: [WeeklyPlanningRequestsController],
  exports: [WeeklyPlanningRequestsService],
})
export class WeeklyPlanningRequestsModule {}
