import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

import { TrainingTimePreference } from '@prisma/client';

export class CreateWeeklyPlanningRequestDto {
  @IsDateString()
  weekStartDate!: string;

  @IsBoolean()
  workThisWeek!: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  trainingSessionsTarget?: number;

  @IsOptional()
  @IsEnum(TrainingTimePreference)
  trainingTimePreference?: TrainingTimePreference;

  @IsBoolean()
  wantsStudy!: boolean;

  // Required when wantsStudy is true
  @ValidateIf((o: CreateWeeklyPlanningRequestDto) => o.wantsStudy === true)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  studyTopics?: string[];

  @IsBoolean()
  wantsSpouseActivity!: boolean;

  @IsBoolean()
  wantsMealPlanning!: boolean;

  // Required when wantsMealPlanning is true
  @ValidateIf((o: CreateWeeklyPlanningRequestDto) => o.wantsMealPlanning === true)
  @IsInt()
  @Min(1)
  mealsPerDay?: number;

  // Required when wantsMealPlanning is true
  @ValidateIf((o: CreateWeeklyPlanningRequestDto) => o.wantsMealPlanning === true)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  mealNames?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
