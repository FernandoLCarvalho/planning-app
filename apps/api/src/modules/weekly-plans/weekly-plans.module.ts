import { Module } from '@nestjs/common';

import { AiPlannerModule } from '@/modules/ai-planner/ai-planner.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { WeeklyPlansService } from './application/weekly-plans.service';
import { WeeklyPlansController } from './presentation/weekly-plans.controller';

@Module({
  imports: [AuthModule, AiPlannerModule],
  providers: [WeeklyPlansService],
  controllers: [WeeklyPlansController],
  exports: [WeeklyPlansService],
})
export class WeeklyPlansModule {}
