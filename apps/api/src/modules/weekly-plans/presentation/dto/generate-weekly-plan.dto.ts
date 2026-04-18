import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateWeeklyPlanDto {
  @IsString()
  @IsNotEmpty()
  weeklyPlanningRequestId!: string;

  @IsOptional()
  @IsBoolean()
  regenerate?: boolean;
}
