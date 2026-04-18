import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import type { CreateWeeklyPlanningRequestDto } from '../presentation/dto/create-weekly-planning-request.dto';
import type { UpdateWeeklyPlanningRequestDto } from '../presentation/dto/update-weekly-planning-request.dto';

@Injectable()
export class WeeklyPlanningRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWeeklyPlanningRequestDto) {
    return this.prisma.weeklyPlanningRequest.create({
      data: {
        userId,
        weekStartDate: new Date(dto.weekStartDate),
        workThisWeek: dto.workThisWeek,
        trainingSessionsTarget: dto.trainingSessionsTarget,
        trainingTimePreference: dto.trainingTimePreference,
        wantsStudy: dto.wantsStudy,
        studyTopics: dto.studyTopics ?? [],
        wantsSpouseActivity: dto.wantsSpouseActivity,
        wantsMealPlanning: dto.wantsMealPlanning,
        mealsPerDay: dto.mealsPerDay,
        mealNames: dto.mealNames ?? [],
        notes: dto.notes,
      },
    });
  }

  async findById(requestId: string, userId: string) {
    const request = await this.prisma.weeklyPlanningRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Weekly planning request not found');
    }

    if (request.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return request;
  }

  async update(
    requestId: string,
    userId: string,
    dto: UpdateWeeklyPlanningRequestDto,
  ) {
    await this.findById(requestId, userId);

    return this.prisma.weeklyPlanningRequest.update({
      where: { id: requestId },
      data: {
        ...(dto.weekStartDate !== undefined && {
          weekStartDate: new Date(dto.weekStartDate),
        }),
        ...(dto.workThisWeek !== undefined && { workThisWeek: dto.workThisWeek }),
        ...(dto.trainingSessionsTarget !== undefined && {
          trainingSessionsTarget: dto.trainingSessionsTarget,
        }),
        ...(dto.trainingTimePreference !== undefined && {
          trainingTimePreference: dto.trainingTimePreference,
        }),
        ...(dto.wantsStudy !== undefined && { wantsStudy: dto.wantsStudy }),
        ...(dto.studyTopics !== undefined && { studyTopics: dto.studyTopics }),
        ...(dto.wantsSpouseActivity !== undefined && {
          wantsSpouseActivity: dto.wantsSpouseActivity,
        }),
        ...(dto.wantsMealPlanning !== undefined && {
          wantsMealPlanning: dto.wantsMealPlanning,
        }),
        ...(dto.mealsPerDay !== undefined && { mealsPerDay: dto.mealsPerDay }),
        ...(dto.mealNames !== undefined && { mealNames: dto.mealNames }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }
}
