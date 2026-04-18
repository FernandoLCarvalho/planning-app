# Product Vision — Personal Adaptive Planner

## 1. Product summary
Personal Adaptive Planner is a personal weekly planning system that transforms human intention into structured execution.

The product exists to help one primary user organize real life in a way that is adaptive, realistic, and sustainable.

It combines:
- structured weekly input;
- free-form contextual input;
- backend orchestration;
- AI-assisted planning;
- persistent weekly plans;
- editable execution blocks;
- versioned replanning.

Core definition:
A compiler from human intention to executable weekly structure.

## 2. Core problem
The target user does not primarily suffer from lack of ambition or lack of goals. The real problem is the gap between intention and execution.

Current pain points:
- the week is often decided reactively, day by day;
- planning is mentally expensive;
- work, training, study, health, meals, and relationship time compete for attention;
- existing planning apps are often too rigid, too generic, or too manual;
- raw LLM usage requires repeated prompting and produces inconsistent outputs;
- AI outputs are often not persisted in a reusable operational form.

The product is designed to reduce decision fatigue and convert scattered intention into a usable weekly plan.

## 3. Product promise
The system should help the user answer a practical question every week:

> Given my real context, what is the most realistic and useful structure for this week?

And, when necessary:

> Given that life changed, how should the rest of the week adapt without collapsing everything?

## 4. Experience principles
The product must feel:
- calm;
- intelligent;
- lightweight;
- adaptive;
- discreet;
- realistic.

The product must not feel:
- moralistic;
- punitive;
- overly controlling;
- artificially motivational;
- corporate or bureaucratic;
- more exhausting than the problem it tries to solve.

## 5. Core product principles
- Low friction beats theoretical completeness.
- Adaptation matters more than rigid optimization.
- Real life context matters more than idealized productivity.
- The system should reduce cognitive load, not increase it.
- Planning must be executable, not merely well written.
- AI is an adaptation engine, not the system itself.
- Persistence and versioning are part of the product value.

## 6. Primary use case
The product is a personal weekly planning app for recurring use by one main user.

The user wants to balance:
- work obligations;
- training sessions;
- study goals;
- meals and daily anchors;
- relationship time;
- health and energy constraints;
- unexpected disruptions.

The app is not primarily a task manager, habit tracker, or generic calendar. It is a weekly planning and replanning system.

## 7. Product scope for v1
Version 1 focuses on the weekly planning core.

Primary capabilities:
- authenticate the user;
- collect and persist user preferences;
- collect a structured weekly planning request;
- generate a weekly plan;
- show the current weekly plan clearly;
- allow manual block edits;
- support urgency-based replanning;
- preserve version history of plans;
- remain ready for later notifications and calendar export.

Out of scope for the initial MVP unless explicitly requested:
- advanced gamification;
- social features;
- multi-user collaboration;
- complex calendar drag-and-drop interfaces;
- heavy analytics;
- aggressive recommendation systems;
- large-scale infra patterns.

## 8. Core system model
The product has three core layers.

### 8.1 Structured input
The user provides objective input for the week through forms.

Examples:
- whether the user will work this week;
- number of desired training sessions;
- whether study is a focus;
- study topics;
- whether meal planning is desired;
- whether spouse activity should be included;
- simple notes about the week.

### 8.2 Free-form contextual input
The user can provide natural language context, especially during replanning.

Examples:
- travel or family emergencies;
- fatigue or reduced capacity;
- time compression during the week;
- disruptions that require preserving only the most important items.

### 8.3 Backend orchestration
The backend transforms inputs into a safe operational flow.

Responsibilities:
- load preferences and current state;
- build planning context;
- assemble prompts;
- call the AI provider;
- validate the response;
- persist the plan;
- version replans;
- expose read models for the frontend.

## 9. Weekly planning flow
### 9.1 Initial planning
1. The user fills the weekly planning form.
2. The backend loads persistent preferences.
3. The planning context is assembled.
4. The AI planner receives structured context.
5. The AI returns a structured plan.
6. The backend validates the result.
7. The backend persists a new `WeeklyPlan`, `DailyAnchor[]`, `PlannedBlock[]`, and `PlanRevision`.
8. The frontend renders the week.
9. The user may confirm, edit, or later replan.

### 9.2 Urgency replanning
1. The user opens the urgency flow.
2. The user submits urgency level, mode, and a free-form message.
3. The backend loads the active weekly plan and its current blocks.
4. The backend builds a context focused on the remaining week.
5. The AI proposes changes using actions such as keep, move, drop, shrink, expand, convert, create, and create_buffer.
6. The backend validates the response.
7. The backend creates a new version of the weekly plan.
8. The frontend renders the updated week while preserving continuity.

## 10. Domain entities
Expected core entities:
- `User`
- `UserPreferences`
- `WeeklyPlanningRequest`
- `WeeklyPlan`
- `DailyAnchor`
- `PlannedBlock`
- `PlanRevision`

### 10.1 UserPreferences
Stores persistent planning context.

Examples:
- planning style;
- notification tolerance;
- training time preference;
- meal defaults;
- energy pattern;
- preferred sleep time;
- preferred wake window.

### 10.2 WeeklyPlanningRequest
Stores structured weekly intent before a plan exists.

### 10.3 WeeklyPlan
Stores one version of the planned week.

Expected conceptual fields:
- user reference;
- week start date;
- version number;
- basedOnPlanId;
- status;
- plan metadata.

### 10.4 DailyAnchor
Stores fixed reference points that help structure the day.

Examples:
- wake up;
- sleep;
- meal anchors;
- work start.

### 10.5 PlannedBlock
Stores executable weekly units.

Examples:
- training block;
- study block;
- work block;
- spouse block;
- rest block;
- buffer block.

### 10.6 PlanRevision
Stores traceability for initial generation, urgency replans, manual changes, or regeneration.

## 11. Daily anchors
Daily anchors are central to the planning model.

They are not just decorative metadata. They are structural reference points that help the planner organize the day in a coherent way.

Examples:
- wake up time;
- sleep time;
- lunch time;
- dinner time;
- work start time.

Important modeling distinction:
- preferred wake window belongs to `UserPreferences` because it is a persistent preference;
- actual `dailyAnchors` belong to `WeeklyPlan` because they are generated outcomes of a specific plan version.

## 12. Role of AI
AI is a planning adaptation layer.

AI should:
- interpret context;
- balance priorities;
- generate realistic structure;
- replan only what needs to change;
- account for friction, sleep, energy, and feasibility.

AI should not:
- manage product state;
- persist anything directly;
- decide API behavior;
- bypass validation;
- replace the domain model.

## 13. Planning context philosophy
The system should not send raw, noisy data directly to the model.

The product depends on a context-building layer that:
- selects relevant information;
- removes irrelevant noise;
- normalizes values;
- reduces token waste;
- improves consistency;
- keeps planning and replanning on the same conceptual foundation.

This is why the planning flow is organized around:
- `PlanningContextBuilderService`
- `PromptAssemblerService`
- `AIPlannerService`
- `AIResponseValidatorService`
- `WeeklyPlanService` and `ReplanningService`

## 14. AI output contract philosophy
The system must operate on structured output, not conversational prose.

The expected AI response root is:
- `planMetadata`
- `dailyAnchors`
- `blocks`
- `actions`
- `notes`
- `warnings`

This matters because the product value is not “interesting AI text.”
The value is a validated, persistent, editable weekly plan.

## 15. Versioning philosophy
Replanning must preserve continuity.

The user should not feel like the whole week was discarded every time something changes.

Recommended behavior:
- each meaningful replan generates a new `WeeklyPlan` version;
- the new version references the previous one using `basedOnPlanId`;
- completed blocks remain visible in the newer version during the MVP;
- the newest version becomes the active operational reference;
- previous versions remain available for history and traceability.

## 16. Frontend experience vision
The frontend should be mobile-first and optimized for recurring personal use on iPhone.

The first version should prioritize a small number of clear screens:
- login;
- onboarding/preferences;
- create weekly planning request;
- current week;
- weekly plan detail;
- urgency replan;
- block edit;
- preferences update.

The weekly experience should begin with a simple day-by-day list and cards, not with a complex calendar UI.

## 17. Emotional UX target
When the user opens the app, the experience should communicate:
- “this understands real life”;
- “this helps me think less, not more”;
- “this is flexible without being vague”;
- “this is smart, but still grounded.”

## 18. Technical direction
### 18.1 Frontend v1
Preferred stack:
- React Native
- Expo
- Expo Router
- TypeScript
- TanStack Query
- React Hook Form
- Zod
- date-fns
- Zustand only if truly necessary

### 18.2 Backend v1
Preferred stack:
- NestJS
- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Swagger/OpenAPI
- class-validator and class-transformer for HTTP DTOs
- Zod for critical internal contracts

### 18.3 Infrastructure philosophy
- modular monolith;
- simple deployment path;
- Docker for backend and database when needed;
- no microservices on day one;
- no Redis, queues, or CQRS on day one unless explicitly required.

## 19. Product phases
### Phase 1
Prompt builder and planning architecture foundation.

### Phase 2
AI-assisted weekly planning.

### Phase 3
Urgency-based replanning.

### Phase 4
Persistence maturity, calendar export, and notifications.

### Phase 5
Adaptive intelligence based on behavior, adherence, and contextual evolution.

## 20. Long-term vision
In the long run, the product may evolve toward:
- adherence analysis;
- better load balancing over time;
- contextual recommendations;
- richer sleep and health integration;
- more personalized planning strategy selection;
- reduced prompt cost through more stable planning pipelines.

But the first success metric is simpler:

> The user should be able to open the app each week, generate a realistic plan, adjust it when life changes, and actually use it.

## 21. Success criteria for the MVP
The MVP is successful if it reliably enables the user to:
- persist planning preferences;
- generate a usable weekly plan;
- understand the week at a glance;
- edit blocks without friction;
- replan after disruption without losing continuity;
- trust that the output is structured, stable, and actionable.

## 22. Final product statement
Personal Adaptive Planner is not just a planner UI and not just an LLM wrapper.

It is a full system that translates intention into execution through:
- structured inputs;
- contextual interpretation;
- validated AI output;
- persistent plan versions;
- simple operational UX.

Its real value is the bridge between human chaos and structured weekly action.