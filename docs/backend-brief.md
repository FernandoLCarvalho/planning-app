# Backend Brief — Personal Adaptive Planner v1

## 1. Objective
Build the backend MVP for a personal adaptive weekly planning system.

The backend must transform:
- persistent user preferences;
- structured weekly planning intent;
- free-form urgency context;

into:
- persisted weekly plans;
- editable planned blocks;
- versioned replans;
- a future-ready base for calendar export and notifications.

## 2. Official backend stack
- NestJS
- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Swagger / OpenAPI
- class-validator
- class-transformer
- Zod for critical internal contracts

## 3. Architecture strategy
Use a modular monolith with light DDD by feature.

Preferred structure:

```text
apps/api/
  src/
    app.module.ts
    main.ts

    shared/
      errors/
      types/
      utils/

    infrastructure/
      prisma/
        prisma.module.ts
        prisma.service.ts

    modules/
      auth/
        application/
        domain/
        infrastructure/
        presentation/
        auth.module.ts

      users/
        application/
        domain/
        infrastructure/
        presentation/
        users.module.ts

      user-preferences/
        application/
        domain/
        infrastructure/
        presentation/
        user-preferences.module.ts

      weekly-planning-requests/
        application/
        domain/
        infrastructure/
        presentation/
        weekly-planning-requests.module.ts

      weekly-plans/
        application/
        domain/
        infrastructure/
        presentation/
        weekly-plans.module.ts

      planned-blocks/
        application/
        domain/
        infrastructure/
        presentation/
        planned-blocks.module.ts

      plan-revisions/
        application/
        domain/
        infrastructure/
        presentation/
        plan-revisions.module.ts

      ai-planner/
        application/
        domain/
        infrastructure/
        presentation/
        ai-planner.module.ts

      calendar/
        application/
        domain/
        infrastructure/
        presentation/
        calendar.module.ts

      notifications/
        application/
        domain/
        infrastructure/
        presentation/
        notifications.module.ts
```

## 4. Architectural rules
- Prefer strong services and thin controllers.
- Keep public planning endpoints under `weekly-plans`, even if orchestration uses `ai-planner` internally.
- Do not create a heavy repository layer early.
- Use `PrismaService` directly in application services when the query is simple.
- Introduce repositories only when duplication or query complexity clearly justifies it.
- Keep AI orchestration isolated from persistence.
- Keep persistence isolated from prompt construction.
- Use transactions for plan creation and replanning flows.
- Prefer clarity and legibility over abstraction.

## 5. MVP modules
### auth
Responsibilities:
- register;
- login;
- refresh;
- authenticated user context.

### users
Responsibilities:
- basic authenticated user data.

### user-preferences
Responsibilities:
- persistent planning preferences.

### weekly-planning-requests
Responsibilities:
- store the weekly planning form before plan generation.

### weekly-plans
Responsibilities:
- generate a weekly plan;
- return the current plan;
- return a plan by id;
- confirm or reject a plan;
- expose replanning through the public API.

### planned-blocks
Responsibilities:
- manual block editing;
- complete / skip actions;
- future manual block creation.

### plan-revisions
Responsibilities:
- revision history and traceability.

### ai-planner
Internal AI layer responsibilities:
- `PlanningContextBuilderService`
- `PromptAssemblerService`
- `AIPlannerService`
- `AIResponseValidatorService`
- `ReplanningService`

### calendar
Responsibilities:
- future calendar export.

### notifications
Responsibilities:
- future reminders.

## 6. MVP endpoints
### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

### User Preferences
- `GET /users/me/preferences`
- `PUT /users/me/preferences`

### Weekly Planning Requests
- `POST /weekly-planning-requests`
- `GET /weekly-planning-requests/:id`
- `PUT /weekly-planning-requests/:id`

### Weekly Plans
- `POST /weekly-plans/generate`
- `GET /weekly-plans/current`
- `GET /weekly-plans/:id`
- `POST /weekly-plans/:id/confirm`
- `POST /weekly-plans/:id/reject`
- `POST /weekly-plans/:id/replan`

### Planned Blocks
- `GET /weekly-plans/:id/blocks`
- `PATCH /planned-blocks/:id`
- `DELETE /planned-blocks/:id`
- `POST /planned-blocks/:id/complete`
- `POST /planned-blocks/:id/skip`

### Plan Revisions
- `GET /weekly-plans/:id/revisions`

## 7. Main execution flows
### Generate Plan
Public flow:
1. user creates a `WeeklyPlanningRequest`;
2. client calls `POST /weekly-plans/generate`;
3. backend generates a plan;
4. frontend renders the week;
5. user confirms or edits.

Internal flow:
1. load `WeeklyPlanningRequest`;
2. load `UserPreferences`;
3. build context with `PlanningContextBuilderService`;
4. assemble prompt with `PromptAssemblerService`;
5. call the provider with `AIPlannerService`;
6. validate output with `AIResponseValidatorService`;
7. persist with `WeeklyPlanService.createInitialPlan()`;
8. return a `WeeklyPlanReadModel`.

### Replan
Public flow:
1. user submits urgency context;
2. client calls `POST /weekly-plans/:id/replan`;
3. backend generates a new plan version;
4. frontend renders the new version.

Internal flow:
1. load active plan;
2. load blocks and anchors;
3. load user preferences;
4. build replanning context;
5. assemble prompt;
6. call AI provider;
7. validate output;
8. persist new version with `ReplanningService.createReplannedVersion()`;
9. return a `WeeklyPlanReadModel`.

## 8. Core domain entities
Expected entities:
- `User`
- `UserPreferences`
- `WeeklyPlanningRequest`
- `WeeklyPlan`
- `DailyAnchor`
- `PlannedBlock`
- `PlanRevision`

### UserPreferences
Expected fields:
- `planningStyle`
- `notificationTolerance`
- `trainingTimePreference`
- `mealDefaults`
- `energyPattern`
- `preferredTimeToSleep`
- `preferredWakeWindow`

### WeeklyPlanningRequest
Expected conceptual fields:
- `userId`
- `weekStartDate`
- `responses` or explicit normalized fields for weekly intent

### WeeklyPlan
Expected conceptual fields:
- `id`
- `userId`
- `weekStartDate`
- `version`
- `basedOnPlanId`
- `status`
- `planMetadata`

### DailyAnchor
Expected conceptual fields:
- `weeklyPlanId`
- `dayOfWeek`
- `type`
- `time`
- `label?`

### PlannedBlock
Expected conceptual fields:
- `weeklyPlanId`
- `dayOfWeek`
- `activityType`
- `title`
- `description?`
- `startTime`
- `endTime`
- `priority`
- `flexibility`
- `status`
- `source`

### PlanRevision
Expected conceptual fields:
- `weeklyPlanId`
- `type`
- `userMessage?`
- `summary?`
- `createdAt`

## 9. Core DTOs
### UserPreferencesDto
Fields:
- `planningStyle`
- `notificationTolerance`
- `trainingTimePreference`
- `mealDefaults`
- `energyPattern`
- `preferredTimeToSleep`
- `preferredWakeWindow`

Validation rules:
- `trainingTimePreference` must not be empty;
- `preferredTimeToSleep` must follow `HH:mm`;
- `preferredWakeWindow.start < preferredWakeWindow.end`.

### CreateWeeklyPlanningRequestDto
Fields:
- `weekStartDate`
- `workThisWeek`
- `trainingSessionsTarget`
- `trainingTimePreference`
- `wantsStudy`
- `studyTopics`
- `wantsSpouseActivity`
- `wantsMealPlanning`
- `mealsPerDay`
- `mealNames`
- `notes`

Validation rules:
- if `wantsStudy = true`, `studyTopics` must exist and contain at least one item;
- if `wantsMealPlanning = true`, `mealsPerDay` and `mealNames` must exist;
- if `trainingSessionsTarget` exists, it must be `>= 1`.

### GenerateWeeklyPlanDto
Fields:
- `weeklyPlanningRequestId`
- `regenerate?`

### ReplanWeeklyPlanDto
Fields:
- `urgencyLevel`
- `message`
- `mode`

Validation rules:
- all fields required;
- `message` must be non-empty and meaningful.

### UpdatePlannedBlockDto
Editable fields:
- `dayOfWeek`
- `startTime`
- `endTime`
- `title`
- `description`
- `priority`
- `flexibility`
- `status`

## 10. Critical internal AI contract
The AI must return only valid JSON with this root shape:

```json
{
  "planMetadata": {},
  "dailyAnchors": [],
  "blocks": [],
  "actions": [],
  "notes": [],
  "warnings": []
}
```

Rules:
- do not accept narrative text outside the JSON;
- validate with Zod before persistence;
- if invalid, reject and use retry or controlled fallback.

### planMetadata
Expected fields:
- `strategy`
- `focusLevel`
- `flexibilityLevel`
- `reasoningSummary`
- `totalPlannedBlocks`

### dailyAnchors
Allowed types:
- `wake_up`
- `sleep`
- `meal`
- `work_start`

### blocks
Each block must contain:
- `id`
- `externalReferenceId?`
- `dayOfWeek`
- `startTime`
- `endTime`
- `durationMinutes`
- `activityType`
- `title`
- `description?`
- `priority`
- `flexibility`
- `energyDemand`
- `source: "ai"`
- `tags?`

### actions
Allowed action types:
- `keep`
- `move`
- `drop`
- `shrink`
- `expand`
- `create`
- `convert`
- `create_buffer`

## 11. AI orchestration services
### PlanningContextBuilderService
Transforms preferences, weekly intent, current plan state, remaining blocks, urgency, and internal rules into structured context.

### PromptAssemblerService
Transforms structured context into the final payload sent to the model.

### AIPlannerService
Calls the configured provider.

Responsibilities:
- receive assembled prompt payload;
- call the provider with stable parameters;
- capture raw output;
- return raw output for validation;
- register execution metadata.

### AIResponseValidatorService
Responsibilities:
- parse model output;
- extract JSON when explicitly needed;
- validate with Zod;
- reject or accept;
- normalize only safe small issues.

### WeeklyPlanService
Responsibilities:
- create the initial persisted plan;
- persist anchors and blocks;
- create `PlanRevision`;
- return a `WeeklyPlanReadModel`.

### ReplanningService
Responsibilities:
- load active base plan;
- identify completed, pending, and optional blocks;
- apply validated actions;
- create a new `WeeklyPlan` version;
- preserve continuity and history.

## 12. Validation strategy
### HTTP input validation
Use NestJS DTO classes with:
- `class-validator`
- `class-transformer`
- global `ValidationPipe`

Recommended global pipe:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
  }),
);
```

### Internal critical validation
Use Zod for:
- `AIPlannerResponseSchema`;
- AI output parsing;
- other critical internal contracts when needed.

## 13. Versioning rules
- each meaningful revision creates a new `WeeklyPlan`;
- the new plan references the old one through `basedOnPlanId`;
- the replanned week remains complete in the MVP;
- completed blocks must remain visible in the newer version;
- there can be multiple `suggested` versions, but the newest relevant one is the default reference;
- only one `accepted` plan should exist per user per week;
- confirming a newer plan may archive older versions.

## 14. Replanning behavior rules
- replanning should preserve continuity;
- do not rebuild the whole week unless the mode explicitly justifies it;
- `keep` copies the block with minimal change;
- `move` changes day and/or time;
- `drop` removes the block from the new version;
- `shrink` reduces duration;
- `expand` increases duration;
- `convert` changes type, intensity, or flexibility;
- `create` creates a new block;
- `create_buffer` creates a buffer block.

## 15. Persistence rules
- `WeeklyPlanService` and `ReplanningService` must operate in a single transaction;
- do not persist raw model output as domain truth;
- return a read model already shaped for the frontend;
- avoid forcing the frontend to manually reconstruct the week from multiple tables.

## 16. WeeklyPlanReadModel expectation
Return a response shaped for rendering, conceptually like:

```json
{
  "weeklyPlan": {
    "id": "plan_1",
    "version": 1,
    "status": "suggested",
    "strategy": "balanced",
    "focusLevel": "medium",
    "flexibilityLevel": "high",
    "reasoningSummary": "Plan distributed with focus on consistency and low friction."
  },
  "dailyAnchors": [],
  "blocks": [],
  "notes": [],
  "warnings": []
}
```

The exact TypeScript implementation can vary, but the frontend must receive a coherent, render-ready structure.

## 17. Observability requirements
At minimum, track:
- template version;
- provider;
- model;
- planning mode;
- latency;
- success or failure;
- approximate context size;
- approximate output size;
- validation issues count;
- whether normalization occurred.

## 18. Initial implementation order
1. bootstrap NestJS with Fastify, Swagger, and global `ValidationPipe`;
2. configure Prisma and PostgreSQL;
3. implement `auth`;
4. implement `users`;
5. implement `user-preferences`;
6. implement `weekly-planning-requests`;
7. implement real DTOs;
8. implement `AIPlannerResponseSchema`;
9. implement AI planner services;
10. implement `weekly-plans` generate / current / confirm;
11. implement `planned-blocks` editing actions;
12. implement replanning;
13. implement `plan-revisions`;
14. leave `calendar` and `notifications` minimal and future-ready.

## 19. Coding rules for backend work
- Maintain architecture by feature/module.
- Do not move files into shared/common without a clear reason.
- Avoid premature abstractions.
- Use explicit semantic names.
- Prefer legibility and maintainability.
- Keep controllers thin.
- Keep services strong.
- Use Prisma pragmatically.
- Respect the AI planner contract.
- Choose the simplest solution that matches the documented MVP.

## 20. Immediate goal
Generate the backend foundation in `apps/api` with:
- the expected folder structure;
- NestJS + Fastify bootstrap;
- Prisma setup;
- initial modules;
- HTTP DTOs;
- AI planner Zod schema;
- initial generation flow;
- initial persistence-ready architecture.