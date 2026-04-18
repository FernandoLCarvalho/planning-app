import { z } from 'zod';

const TIME_REGEX = /^\d{2}:\d{2}$/;
const timeField = (label: string) =>
  z.string().regex(TIME_REGEX, `${label} must be in HH:mm format`);

// ---------------------------------------------------------------------------
// Primitive enums
// ---------------------------------------------------------------------------

export const AIPlannerDayOfWeekSchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

export const AIPlannerAnchorTypeSchema = z.enum([
  'WAKE_UP',
  'SLEEP',
  'MEAL',
  'WORK_START',
]);

export const AIPlannerActivityTypeSchema = z.enum([
  'TRAINING',
  'STUDY',
  'WORK',
  'REST',
  'MEAL',
  'SPOUSE',
  'BUFFER',
  'OTHER',
]);

export const AIPlannerBlockPrioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

export const AIPlannerBlockFlexibilitySchema = z.enum([
  'FIXED',
  'FLEXIBLE',
  'OPTIONAL',
]);

export const AIPlannerEnergyDemandSchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

// The AI must always produce blocks with source = "AI".
export const AIPlannerBlockSourceSchema = z.literal('AI');

export const AIPlannerActionTypeSchema = z.enum([
  'keep',
  'move',
  'drop',
  'shrink',
  'expand',
  'create',
  'convert',
  'create_buffer',
]);

// ---------------------------------------------------------------------------
// Object schemas
// ---------------------------------------------------------------------------

export const AIPlannerPlanMetadataSchema = z.object({
  strategy: z.string().min(1),
  focusLevel: z.string().min(1),
  flexibilityLevel: z.string().min(1),
  reasoningSummary: z.string().min(1),
  totalPlannedBlocks: z.number().int().nonnegative(),
});

export const AIPlannerDailyAnchorSchema = z.object({
  dayOfWeek: AIPlannerDayOfWeekSchema,
  type: AIPlannerAnchorTypeSchema,
  time: timeField('time'),
  label: z.string().optional(),
});

export const AIPlannerBlockSchema = z.object({
  id: z.string().min(1),
  externalReferenceId: z.string().optional(),
  dayOfWeek: AIPlannerDayOfWeekSchema,
  startTime: timeField('startTime'),
  endTime: timeField('endTime'),
  durationMinutes: z.number().int().positive(),
  activityType: AIPlannerActivityTypeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  priority: AIPlannerBlockPrioritySchema,
  flexibility: AIPlannerBlockFlexibilitySchema,
  energyDemand: AIPlannerEnergyDemandSchema,
  source: AIPlannerBlockSourceSchema,
  tags: z.array(z.string()).default([]),
});

export const AIPlannerActionSchema = z.object({
  blockId: z.string().min(1),
  type: AIPlannerActionTypeSchema,
});

// ---------------------------------------------------------------------------
// Root response schema
// ---------------------------------------------------------------------------

export const AIPlannerResponseSchema = z.object({
  planMetadata: AIPlannerPlanMetadataSchema,
  dailyAnchors: z.array(AIPlannerDailyAnchorSchema),
  blocks: z.array(AIPlannerBlockSchema).min(1, 'At least one block is required'),
  actions: z.array(AIPlannerActionSchema).default([]),
  notes: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type AIPlannerResponse = z.infer<typeof AIPlannerResponseSchema>;
export type AIPlannerPlanMetadata = z.infer<typeof AIPlannerPlanMetadataSchema>;
export type AIPlannerDailyAnchor = z.infer<typeof AIPlannerDailyAnchorSchema>;
export type AIPlannerBlock = z.infer<typeof AIPlannerBlockSchema>;
export type AIPlannerAction = z.infer<typeof AIPlannerActionSchema>;
