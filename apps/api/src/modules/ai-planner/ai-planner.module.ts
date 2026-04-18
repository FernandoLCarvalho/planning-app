import { Module } from '@nestjs/common';

import { AIResponseValidatorService } from './application/ai-response-validator.service';
import { AIPlannerService } from './application/ai-planner.service';
import { PlanningContextBuilderService } from './application/planning-context-builder.service';
import { PromptAssemblerService } from './application/prompt-assembler.service';

@Module({
  providers: [
    AIPlannerService,
    AIResponseValidatorService,
    PlanningContextBuilderService,
    PromptAssemblerService,
  ],
  exports: [
    AIPlannerService,
    AIResponseValidatorService,
    PlanningContextBuilderService,
    PromptAssemblerService,
  ],
})
export class AiPlannerModule {}
