import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AiPlannerModule } from './modules/ai-planner/ai-planner.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PlanRevisionsModule } from './modules/plan-revisions/plan-revisions.module';
import { PlannedBlocksModule } from './modules/planned-blocks/planned-blocks.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
import { UsersModule } from './modules/users/users.module';
import { WeeklyPlanningRequestsModule } from './modules/weekly-planning-requests/weekly-planning-requests.module';
import { WeeklyPlansModule } from './modules/weekly-plans/weekly-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    UserPreferencesModule,
    WeeklyPlanningRequestsModule,
    WeeklyPlansModule,
    PlannedBlocksModule,
    PlanRevisionsModule,
    AiPlannerModule,
    CalendarModule,
    NotificationsModule,
  ],
})
export class AppModule {}
