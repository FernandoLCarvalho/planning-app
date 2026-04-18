import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

import {
  EnergyPattern,
  NotificationTolerance,
  PlanningStyle,
  TrainingTimePreference,
} from '@prisma/client';

export class MealDefaultItemDto {
  @IsString()
  name!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time must be in HH:mm format' })
  time!: string;
}

export class WakeWindowDto {
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'start must be in HH:mm format' })
  start!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'end must be in HH:mm format' })
  end!: string;
}

export class UpdateUserPreferencesDto {
  @IsOptional()
  @IsEnum(PlanningStyle)
  planningStyle?: PlanningStyle;

  @IsOptional()
  @IsEnum(NotificationTolerance)
  notificationTolerance?: NotificationTolerance;

  @IsEnum(TrainingTimePreference)
  trainingTimePreference!: TrainingTimePreference;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDefaultItemDto)
  mealDefaults?: MealDefaultItemDto[];

  @IsOptional()
  @IsEnum(EnergyPattern)
  energyPattern?: EnergyPattern;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'preferredTimeToSleep must be in HH:mm format',
  })
  preferredTimeToSleep!: string;

  @ValidateNested()
  @Type(() => WakeWindowDto)
  preferredWakeWindow!: WakeWindowDto;
}
