import { Injectable } from '@nestjs/common';

import type { PlanningContext } from './planning-context-builder.service';

export interface AssembledPrompt {
  systemPrompt: string;
  userPrompt: string;
}

@Injectable()
export class PromptAssemblerService {
  // TODO: replace with structured prompt construction using the full context.
  assemble(context: PlanningContext): AssembledPrompt {
    const weekStart = context.weeklyPlanningRequest.weekStartDate
      .toISOString()
      .split('T')[0];

    const systemPrompt =
      'You are a personal weekly planner. ' +
      'Return a valid JSON object that strictly matches the AIPlannerResponse schema. ' +
      'Do not include any text outside the JSON object.';

    const userPrompt = `Generate a weekly plan for the week starting on ${weekStart}.`;

    return { systemPrompt, userPrompt };
  }
}
