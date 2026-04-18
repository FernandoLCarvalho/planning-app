import { Injectable, Logger } from '@nestjs/common';

import type { AssembledPrompt } from './prompt-assembler.service';

/**
 * Stub implementation — returns a deterministic fake response.
 * Replace the body of `call()` with real provider integration when ready.
 */
@Injectable()
export class AIPlannerService {
  private readonly logger = new Logger(AIPlannerService.name);

  async call(_prompt: AssembledPrompt): Promise<string> {
    this.logger.warn('AIPlannerService is using a stub — returning fake response');
    return JSON.stringify(STUB_AI_RESPONSE);
  }
}

const STUB_AI_RESPONSE = {
  planMetadata: {
    strategy: 'balanced',
    focusLevel: 'medium',
    flexibilityLevel: 'high',
    reasoningSummary:
      'Stub plan distributed across the week with balanced focus and low friction.',
    totalPlannedBlocks: 3,
  },
  dailyAnchors: [
    { dayOfWeek: 'MONDAY', type: 'WAKE_UP', time: '07:00' },
    { dayOfWeek: 'MONDAY', type: 'WORK_START', time: '09:00' },
    { dayOfWeek: 'MONDAY', type: 'SLEEP', time: '23:00' },
  ],
  blocks: [
    {
      id: 'stub-block-1',
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '11:00',
      durationMinutes: 120,
      activityType: 'WORK',
      title: 'Deep Work Session',
      priority: 'HIGH',
      flexibility: 'FIXED',
      energyDemand: 'HIGH',
      source: 'AI',
      tags: ['work', 'focus'],
    },
    {
      id: 'stub-block-2',
      dayOfWeek: 'TUESDAY',
      startTime: '07:30',
      endTime: '08:30',
      durationMinutes: 60,
      activityType: 'TRAINING',
      title: 'Morning Training',
      priority: 'MEDIUM',
      flexibility: 'FLEXIBLE',
      energyDemand: 'HIGH',
      source: 'AI',
      tags: ['training'],
    },
    {
      id: 'stub-block-3',
      dayOfWeek: 'WEDNESDAY',
      startTime: '19:00',
      endTime: '20:00',
      durationMinutes: 60,
      activityType: 'STUDY',
      title: 'Evening Study',
      priority: 'MEDIUM',
      flexibility: 'FLEXIBLE',
      energyDemand: 'MEDIUM',
      source: 'AI',
      tags: ['study'],
    },
  ],
  actions: [],
  notes: ['This is a stub plan. Real AI provider integration is coming in the next step.'],
  warnings: [],
};
