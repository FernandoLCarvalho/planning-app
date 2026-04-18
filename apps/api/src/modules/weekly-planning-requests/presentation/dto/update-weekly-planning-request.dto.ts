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

export class UpdateWeeklyPlanningRequestDto {
  @IsOptional()
  @IsDateString()
  weekStartDate?: string;

  @IsOptional()
  @IsBoolean()
  workThisWeek?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  trainingSessionsTarget?: number;

  @IsOptional()
  @IsEnum(TrainingTimePreference)
  trainingTimePreference?: TrainingTimePreference;

  @IsOptional()
  @IsBoolean()
  wantsStudy?: boolean;

  // Required when wantsStudy is explicitly set to true in this update
  @ValidateIf((o: UpdateWeeklyPlanningRequestDto) => o.wantsStudy === true)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  studyTopics?: string[];

  @IsOptional()
  @IsBoolean()
  wantsSpouseActivity?: boolean;

  @IsOptional()
  @IsBoolean()
  wantsMealPlanning?: boolean;

  // Required when wantsMealPlanning is explicitly set to true in this update
  @ValidateIf((o: UpdateWeeklyPlanningRequestDto) => o.wantsMealPlanning === true)
  @IsInt()
  @Min(1)
  mealsPerDay?: number;

  // Required when wantsMealPlanning is explicitly set to true in this update
  @ValidateIf((o: UpdateWeeklyPlanningRequestDto) => o.wantsMealPlanning === true)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  mealNames?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
