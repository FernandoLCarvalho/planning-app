export interface WeeklyPlanReadModelMeta {
  id: string;
  version: number;
  status: string;
  weekStartDate: string;
  weeklyPlanningRequestId: string | null;
  createdAt: string;
  planMetadata: {
    strategy: string;
    focusLevel: string;
    flexibilityLevel: string;
    reasoningSummary: string;
    totalPlannedBlocks: number;
  };
}

export interface WeeklyPlanReadModelAnchor {
  id: string;
  dayOfWeek: string;
  type: string;
  time: string;
  label: string | null;
}

export interface WeeklyPlanReadModelBlock {
  id: string;
  dayOfWeek: string;
  activityType: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priority: string;
  flexibility: string;
  energyDemand: string;
  status: string;
  source: string;
  tags: string[];
  externalReferenceId: string | null;
}

export interface WeeklyPlanReadModel {
  weeklyPlan: WeeklyPlanReadModelMeta;
  dailyAnchors: WeeklyPlanReadModelAnchor[];
  blocks: WeeklyPlanReadModelBlock[];
  notes: string[];
  warnings: string[];
}
