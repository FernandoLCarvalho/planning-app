import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import type { UpdateUserPreferencesDto } from '../presentation/dto/update-user-preferences.dto';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  // Upsert on first access: creates defaults if no record exists yet.
  async getOrCreate(userId: string) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  async update(userId: string, dto: UpdateUserPreferencesDto) {
    this.assertWakeWindowOrder(dto);

    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        planningStyle: dto.planningStyle,
        notificationTolerance: dto.notificationTolerance,
        trainingTimePreference: dto.trainingTimePreference,
        energyPattern: dto.energyPattern,
        preferredTimeToSleep: dto.preferredTimeToSleep,
        preferredWakeWindowStart: dto.preferredWakeWindow.start,
        preferredWakeWindowEnd: dto.preferredWakeWindow.end,
        mealDefaults: (dto.mealDefaults ?? undefined) as Prisma.InputJsonValue | undefined,
      },
      update: {
        planningStyle: dto.planningStyle,
        notificationTolerance: dto.notificationTolerance,
        trainingTimePreference: dto.trainingTimePreference,
        energyPattern: dto.energyPattern,
        preferredTimeToSleep: dto.preferredTimeToSleep,
        preferredWakeWindowStart: dto.preferredWakeWindow.start,
        preferredWakeWindowEnd: dto.preferredWakeWindow.end,
        mealDefaults: (dto.mealDefaults ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }

  private assertWakeWindowOrder(dto: UpdateUserPreferencesDto): void {
    const { start, end } = dto.preferredWakeWindow;
    const toMinutes = (hhmm: string) => {
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    };

    if (toMinutes(start) >= toMinutes(end)) {
      throw new BadRequestException(
        'preferredWakeWindow.start must be before preferredWakeWindow.end',
      );
    }
  }
}
