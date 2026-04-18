import { Injectable, Logger } from '@nestjs/common';

import {
  AIPlannerResponseSchema,
  type AIPlannerResponse,
} from '../domain/ai-planner-response.schema';

export type ValidationSuccess = {
  success: true;
  data: AIPlannerResponse;
};

export type ValidationFailure = {
  success: false;
  reason: 'INVALID_JSON' | 'SCHEMA_VALIDATION_FAILED';
  details: string;
};

export type AIValidationResult = ValidationSuccess | ValidationFailure;

@Injectable()
export class AIResponseValidatorService {
  private readonly logger = new Logger(AIResponseValidatorService.name);

  validate(rawOutput: string): AIValidationResult {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawOutput);
    } catch {
      this.logger.warn('AI response could not be parsed as JSON');
      return {
        success: false,
        reason: 'INVALID_JSON',
        details: 'AI response is not valid JSON',
      };
    }

    const result = AIPlannerResponseSchema.safeParse(parsed);

    if (!result.success) {
      const details = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      this.logger.warn(`AI response failed schema validation — ${details}`);
      return {
        success: false,
        reason: 'SCHEMA_VALIDATION_FAILED',
        details,
      };
    }

    return { success: true, data: result.data };
  }
}
