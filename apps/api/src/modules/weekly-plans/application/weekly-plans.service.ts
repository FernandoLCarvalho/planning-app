import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  BlockSource,
  BlockStatus,
  Prisma,
  RevisionType,
  WeeklyPlanStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { AIResponseValidatorService } from '@/modules/ai-planner/application/ai-response-validator.service';
import { AIPlannerService } from '@/modules/ai-planner/application/ai-planner.service';
import { PlanningContextBuilderService } from '@/modules/ai-planner/application/planning-context-builder.service';
import { PromptAssemblerService } from '@/modules/ai-planner/application/prompt-assembler.service';
import type { AIPlannerResponse } from '@/modules/ai-planner/domain/ai-planner-response.schema';
import type {
  WeeklyPlanReadModel,
  WeeklyPlanReadModelAnchor,
  WeeklyPlanReadModelBlock,
} from '../domain/weekly-plan-read-model.interface';
import type { GenerateWeeklyPlanDto } from '../presentation/dto/generate-weekly-plan.dto';

type PersistedWeeklyPlan = Prisma.WeeklyPlanGetPayload<{
  include: { dailyAnchors: true; blocks: true };
}>;

@Injectable()
export class WeeklyPlansService {
  private readonly logger = new Logger(WeeklyPlansService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly planningContextBuilder: PlanningContextBuilderService,
    private readonly promptAssembler: PromptAssemblerService,
    private readonly aiPlanner: AIPlannerService,
    private readonly aiResponseValidator: AIResponseValidatorService,
  ) {}

  async generate(
    userId: string,
    dto: GenerateWeeklyPlanDto,
  ): Promise<WeeklyPlanReadModel> {
    // 1. Load WeeklyPlanningRequest — ownership check included
    const planningRequest = await this.prisma.weeklyPlanningRequest.findUnique({
      where: { id: dto.weeklyPlanningRequestId },
    });

    if (!planningRequest) {
      throw new NotFoundException('Weekly planning request not found');
    }

    if (planningRequest.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // 2. Load UserPreferences — may be null if never set; planner handles it gracefully
    const userPreferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    // 3. Build planning context
    const context = this.planningContextBuilder.build(
      planningRequest,
      userPreferences,
    );

    // 4. Assemble prompt
    const prompt = this.promptAssembler.assemble(context);

    // 5. Call AI provider (stubbed for now)
    const rawAiOutput = await this.aiPlanner.call(prompt);

    // 6. Validate AI output against the Zod contract
    const validationResult = this.aiResponseValidator.validate(rawAiOutput);

    if (!validationResult.success) {
      this.logger.error(
        `AI response validation failed [${validationResult.reason}]: ${validationResult.details}`,
      );
      throw new InternalServerErrorException(
        'AI planner returned an invalid response. Please try again.',
      );
    }

    const aiResponse = validationResult.data;

    // 7. Persist WeeklyPlan + DailyAnchors + PlannedBlocks + PlanRevision in one transaction
    const weeklyPlan = await this.persistInitialPlan(
      userId,
      dto.weeklyPlanningRequestId,
      planningRequest.weekStartDate,
      aiResponse,
    );

    // 8. Return render-ready model
    return this.toReadModel(weeklyPlan, aiResponse);
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  private async persistInitialPlan(
    userId: string,
    weeklyPlanningRequestId: string,
    weekStartDate: Date,
    aiResponse: AIPlannerResponse,
  ): Promise<PersistedWeeklyPlan> {
    return this.prisma.$transaction(async (tx) => {
      return tx.weeklyPlan.create({
        data: {
          userId,
          weeklyPlanningRequestId,
          weekStartDate,
          version: 1,
          status: WeeklyPlanStatus.SUGGESTED,
          planMetadata:
            aiResponse.planMetadata as unknown as Prisma.InputJsonValue,
          dailyAnchors: {
            create: aiResponse.dailyAnchors.map((anchor) => ({
              dayOfWeek: anchor.dayOfWeek,
              type: anchor.type,
              time: anchor.time,
              label: anchor.label ?? null,
            })),
          },
          blocks: {
            create: aiResponse.blocks.map((block) => ({
              dayOfWeek: block.dayOfWeek,
              activityType: block.activityType,
              title: block.title,
              description: block.description ?? null,
              startTime: block.startTime,
              endTime: block.endTime,
              durationMinutes: block.durationMinutes,
              priority: block.priority,
              flexibility: block.flexibility,
              energyDemand: block.energyDemand,
              status: BlockStatus.PENDING,
              source: BlockSource.AI,
              tags: block.tags,
              // Carries the AI-assigned id for action correlation in future replanning
              externalReferenceId: block.id,
            })),
          },
          revisions: {
            create: {
              type: RevisionType.INITIAL_GENERATION,
              summary: aiResponse.planMetadata.reasoningSummary,
            },
          },
        },
        include: {
          dailyAnchors: true,
          blocks: true,
        },
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Read model
  // ---------------------------------------------------------------------------

  private toReadModel(
    weeklyPlan: PersistedWeeklyPlan,
    aiResponse: AIPlannerResponse,
  ): WeeklyPlanReadModel {
    const meta = aiResponse.planMetadata;

    const dailyAnchors: WeeklyPlanReadModelAnchor[] =
      weeklyPlan.dailyAnchors.map((anchor) => ({
        id: anchor.id,
        dayOfWeek: anchor.dayOfWeek,
        type: anchor.type,
        time: anchor.time,
        label: anchor.label,
      }));

    const blocks: WeeklyPlanReadModelBlock[] = weeklyPlan.blocks.map(
      (block) => ({
        id: block.id,
        dayOfWeek: block.dayOfWeek,
        activityType: block.activityType,
        title: block.title,
        description: block.description,
        startTime: block.startTime,
        endTime: block.endTime,
        durationMinutes: block.durationMinutes,
        priority: block.priority,
        flexibility: block.flexibility,
        energyDemand: block.energyDemand,
        status: block.status,
        source: block.source,
        tags: block.tags,
        externalReferenceId: block.externalReferenceId,
      }),
    );

    return {
      weeklyPlan: {
        id: weeklyPlan.id,
        version: weeklyPlan.version,
        status: weeklyPlan.status,
        weekStartDate: weeklyPlan.weekStartDate.toISOString().split('T')[0],
        weeklyPlanningRequestId: weeklyPlan.weeklyPlanningRequestId,
        createdAt: weeklyPlan.createdAt.toISOString(),
        planMetadata: {
          strategy: meta.strategy,
          focusLevel: meta.focusLevel,
          flexibilityLevel: meta.flexibilityLevel,
          reasoningSummary: meta.reasoningSummary,
          totalPlannedBlocks: meta.totalPlannedBlocks,
        },
      },
      dailyAnchors,
      blocks,
      notes: aiResponse.notes,
      warnings: aiResponse.warnings,
    };
  }
}
