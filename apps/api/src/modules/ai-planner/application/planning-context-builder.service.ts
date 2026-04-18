import { Injectable } from '@nestjs/common';
import type { UserPreferences, WeeklyPlanningRequest } from '@prisma/client';

export interface PlanningContext {
  weeklyPlanningRequest: WeeklyPlanningRequest;
  userPreferences: UserPreferences | null;
}

@Injectable()
export class PlanningContextBuilderService {
  build(
    weeklyPlanningRequest: WeeklyPlanningRequest,
    userPreferences: UserPreferences | null,
  ): PlanningContext {
    return { weeklyPlanningRequest, userPreferences };
  }
}
