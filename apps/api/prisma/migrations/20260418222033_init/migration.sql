-- CreateEnum
CREATE TYPE "PlanningStyle" AS ENUM ('BALANCED', 'INTENSE', 'LIGHT');

-- CreateEnum
CREATE TYPE "NotificationTolerance" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TrainingTimePreference" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "EnergyPattern" AS ENUM ('MORNING_PEAK', 'EVENING_PEAK', 'STEADY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "AnchorType" AS ENUM ('WAKE_UP', 'SLEEP', 'MEAL', 'WORK_START');

-- CreateEnum
CREATE TYPE "WeeklyPlanStatus" AS ENUM ('SUGGESTED', 'ACCEPTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('TRAINING', 'STUDY', 'WORK', 'REST', 'MEAL', 'SPOUSE', 'BUFFER', 'OTHER');

-- CreateEnum
CREATE TYPE "BlockPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "BlockFlexibility" AS ENUM ('FIXED', 'FLEXIBLE', 'OPTIONAL');

-- CreateEnum
CREATE TYPE "EnergyDemand" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "BlockStatus" AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED', 'MOVED', 'DROPPED');

-- CreateEnum
CREATE TYPE "BlockSource" AS ENUM ('AI', 'MANUAL');

-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('INITIAL_GENERATION', 'URGENCY_REPLAN', 'MANUAL_EDIT', 'REGENERATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planningStyle" "PlanningStyle" NOT NULL DEFAULT 'BALANCED',
    "notificationTolerance" "NotificationTolerance" NOT NULL DEFAULT 'MEDIUM',
    "trainingTimePreference" "TrainingTimePreference" NOT NULL DEFAULT 'MORNING',
    "energyPattern" "EnergyPattern" NOT NULL DEFAULT 'STEADY',
    "preferredTimeToSleep" TEXT NOT NULL DEFAULT '23:00',
    "preferredWakeWindowStart" TEXT NOT NULL DEFAULT '06:00',
    "preferredWakeWindowEnd" TEXT NOT NULL DEFAULT '08:00',
    "mealDefaults" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPlanningRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "workThisWeek" BOOLEAN NOT NULL DEFAULT true,
    "trainingSessionsTarget" INTEGER,
    "trainingTimePreference" "TrainingTimePreference",
    "wantsStudy" BOOLEAN NOT NULL DEFAULT false,
    "studyTopics" TEXT[],
    "wantsSpouseActivity" BOOLEAN NOT NULL DEFAULT false,
    "wantsMealPlanning" BOOLEAN NOT NULL DEFAULT false,
    "mealsPerDay" INTEGER,
    "mealNames" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPlanningRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weeklyPlanningRequestId" TEXT,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "basedOnPlanId" TEXT,
    "status" "WeeklyPlanStatus" NOT NULL DEFAULT 'SUGGESTED',
    "planMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPlanDailyAnchor" (
    "id" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "type" "AnchorType" NOT NULL,
    "time" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "WeeklyPlanDailyAnchor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedBlock" (
    "id" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "priority" "BlockPriority" NOT NULL DEFAULT 'MEDIUM',
    "flexibility" "BlockFlexibility" NOT NULL DEFAULT 'FLEXIBLE',
    "energyDemand" "EnergyDemand" NOT NULL DEFAULT 'MEDIUM',
    "status" "BlockStatus" NOT NULL DEFAULT 'PENDING',
    "source" "BlockSource" NOT NULL DEFAULT 'AI',
    "tags" TEXT[],
    "externalReferenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanRevision" (
    "id" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,
    "type" "RevisionType" NOT NULL,
    "userMessage" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "WeeklyPlanningRequest_userId_weekStartDate_idx" ON "WeeklyPlanningRequest"("userId", "weekStartDate");

-- CreateIndex
CREATE INDEX "WeeklyPlan_userId_weekStartDate_idx" ON "WeeklyPlan"("userId", "weekStartDate");

-- CreateIndex
CREATE INDEX "WeeklyPlan_userId_status_idx" ON "WeeklyPlan"("userId", "status");

-- CreateIndex
CREATE INDEX "WeeklyPlanDailyAnchor_weeklyPlanId_dayOfWeek_idx" ON "WeeklyPlanDailyAnchor"("weeklyPlanId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "PlannedBlock_weeklyPlanId_dayOfWeek_idx" ON "PlannedBlock"("weeklyPlanId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "PlanRevision_weeklyPlanId_idx" ON "PlanRevision"("weeklyPlanId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPlanningRequest" ADD CONSTRAINT "WeeklyPlanningRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_weeklyPlanningRequestId_fkey" FOREIGN KEY ("weeklyPlanningRequestId") REFERENCES "WeeklyPlanningRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_basedOnPlanId_fkey" FOREIGN KEY ("basedOnPlanId") REFERENCES "WeeklyPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPlanDailyAnchor" ADD CONSTRAINT "WeeklyPlanDailyAnchor_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBlock" ADD CONSTRAINT "PlannedBlock_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanRevision" ADD CONSTRAINT "PlanRevision_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
