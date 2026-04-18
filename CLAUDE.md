## Project overview
Personal Adaptive Planner is a personal weekly planning app for one primary user. The product turns structured weekly intent plus free-form urgency context into executable weekly plans, editable blocks, and versioned replans.

Core product idea: a compiler from human intention to structured weekly execution.

## Product principles
- Low friction over maximum complexity.
- Adaptive, not rigid.
- Useful, calm, and discreet.
- Never moralistic or overly controlling.
- Real life context matters more than theoretical perfect productivity.
- Prefer simple flows that are actually usable every week.

## Repository strategy
This repository is the source of truth for the full-stack MVP.

Expected structure:
- `apps/api` -> NestJS + Fastify + Prisma + PostgreSQL backend.
- `apps/mobile` -> React Native + Expo mobile app.
- `docs/product-vision.md` -> full product and architecture reference.
- `docs/backend-brief.md` -> backend operational brief.
- `docs/frontend-brief.md` -> frontend operational brief.

If the repository is still empty, create the structure above before adding deeper implementation.

## Source of guidance
When working on this repository, follow this priority order:
1. Direct user request in the current task.
2. This `AGENTS.md` file.
3. `docs/backend-brief.md` for backend work.
4. `docs/frontend-brief.md` for frontend work.
5. `docs/product-vision.md` for broader product intent and long-term architectural context.

If two docs conflict, prefer the more specific brief for the area being edited, unless the user explicitly says otherwise.

## Implementation goals for v1
Build a personal MVP that supports:
- authentication;
- persistent user preferences;
- weekly planning request creation;
- weekly plan generation;
- weekly plan reading;
- manual block editing;
- urgency-based replanning;
- versioned plan history;
- future-ready hooks for notifications and calendar export.

## Domain summary
Main domain entities expected in the MVP:
- `User`
- `UserPreferences`
- `WeeklyPlanningRequest`
- `WeeklyPlan`
- `DailyAnchor`
- `PlannedBlock`
- `PlanRevision`

Core planning concepts:
- `UserPreferences` stores persistent preferences such as planning style, sleep, wake window, energy pattern, meal defaults, and training time preference.
- `WeeklyPlanningRequest` stores the user’s structured weekly intent before a plan exists.
- `WeeklyPlan` stores the generated or re-generated plan version for one week.
- `DailyAnchor` stores fixed daily reference points such as wake up, sleep, meals, and work start.
- `PlannedBlock` stores executable blocks for the week.
- `PlanRevision` stores revision history and replanning traceability.

## Backend architecture rules
Use a modular monolith.

Preferred backend stack:
- NestJS
- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Swagger/OpenAPI
- `class-validator` and `class-transformer` for HTTP DTO validation
- Zod for critical internal contracts, especially AI response validation

Preferred backend structure:
- feature modules under `apps/api/src/modules`
- Prisma infrastructure under `apps/api/src/infrastructure/prisma`
- shared utilities only when clearly reusable and justified

Backend modules expected:
- `auth`
- `users`
- `user-preferences`
- `weekly-planning-requests`
- `weekly-plans`
- `planned-blocks`
- `plan-revisions`
- `ai-planner`
- `calendar`
- `notifications`

Backend architectural rules:
- Prefer strong services and thin controllers.
- Keep public planning endpoints under `weekly-plans`, even if orchestration uses `ai-planner` internally.
- Do not add heavy repository abstractions early.
- Use `PrismaService` directly in application services when the query is simple.
- Introduce repositories only when query complexity or duplication justifies it.
- Keep AI integration isolated from persistence concerns.
- Keep persistence isolated from prompt construction concerns.
- Use transactions for plan creation and replanning flows.

## Frontend architecture rules
Preferred frontend stack:
- React Native
- Expo
- Expo Router
- TypeScript
- TanStack Query
- React Hook Form
- Zod
- date-fns
- Zustand only if truly needed for light cross-screen state

Preferred frontend structure:
- route files under `apps/mobile/src/app`
- domain logic under `apps/mobile/src/features`
- shared components under `apps/mobile/src/components`
- API client and infrastructure under `apps/mobile/src/lib`

Frontend architectural rules:
- Mobile-first always.
- Keep screens focused on layout and flow orchestration.
- Keep domain logic in hooks, feature modules, and form schemas.
- Avoid global state unless there is a real cross-screen need.
- Prefer simple list-based weekly visualization in the MVP instead of complex calendar UIs.
- Optimize for frequent personal use on iPhone.

## AI planning layer rules
The AI is responsible for interpretation and adaptation, not for system state management.

Expected internal flow:
1. `PlanningContextBuilderService`
2. `PromptAssemblerService`
3. `AIPlannerService`
4. `AIResponseValidatorService`
5. `WeeklyPlanService` or `ReplanningService`

Rules:
- AI output must be treated as untrusted until validated.
- AI responses must be parsed and validated with Zod before persistence.
- Never persist raw model output directly.
- Prefer stable and predictable prompt construction over creative prompt writing.
- Keep prompt templates versioned.
- Optimize prompts for consistency and token efficiency.
- Support retries and controlled fallback for invalid or failed model responses.

## Critical AI output contract
The AI planner response must return only valid JSON with this root shape:
- `planMetadata`
- `dailyAnchors`
- `blocks`
- `actions`
- `notes`
- `warnings`

Accepted action types:
- `keep`
- `move`
- `drop`
- `shrink`
- `expand`
- `create`
- `convert`
- `create_buffer`

If implementing the validator, treat any extra narrative text outside the JSON as invalid unless the task explicitly asks for safe extraction logic.

## Product behavior rules
- A week can have multiple generated versions, but only one active reference version should drive the current experience.
- Replanning creates a new `WeeklyPlan` version linked by `basedOnPlanId`.
- Completed blocks should remain visible in newer replanned versions during the MVP.
- Confirming a newer version may archive older versions.
- Replanning should preserve continuity and modify only what is necessary.
- Avoid over-engineering notifications and calendar sync in the MVP; keep them future-ready but minimal.

## Coding conventions
- Use clear, explicit, semantic names.
- Avoid generic variable names like `n`, `data2`, or `temp`.
- Prefer readability over cleverness.
- Avoid premature abstractions.
- Keep files cohesive and feature-oriented.
- Write code that is easy to extend in later iterations.
- Do not introduce unnecessary dependencies.
- Keep comments minimal and useful.
- Favor predictable folder structure over personal invention.

## Task execution rules for agents
Before implementing substantial work:
- inspect the relevant brief in `docs/`;
- preserve the agreed project structure;
- avoid inventing architecture that conflicts with the documented MVP;
- make the smallest coherent change that unlocks progress.

When implementing a new feature:
- add or update the minimum necessary types, DTOs, schemas, services, and routes;
- keep backend and frontend contracts aligned;
- prefer end-to-end coherence over partial local optimization.

When something is unspecified:
- choose the simplest option that matches the documented MVP direction;
- do not introduce advanced infrastructure unless clearly required.

## Initial build order
If bootstrapping from zero, prefer this order:
1. create repository structure;
2. add docs and project guidance;
3. bootstrap backend foundation;
4. bootstrap mobile foundation;
5. implement auth;
6. implement user preferences;
7. implement weekly planning request flow;
8. implement AI response contract and validator;
9. implement plan generation flow;
10. implement current week view flow;
11. implement block editing;
12. implement replanning;
13. refine UX and future-ready integrations.

## Definition of done
A task is only considered done when all relevant items below are satisfied:
- code fits the documented architecture;
- code compiles or type-checks successfully;
- linting passes if configured;
- tests pass if they exist for the touched area;
- no major contract mismatch exists between backend and frontend;
- the implementation remains consistent with the MVP scope.

## What to avoid
- Do not create microservices.
- Do not introduce CQRS, event buses, queues, or Redis on day one unless explicitly requested.
- Do not build a heavy design system before the MVP proves itself.
- Do not create repository layers everywhere by default.
- Do not move important business rules into UI screens.
- Do not let raw LLM output leak directly into persistence or API responses.
- Do not optimize for theoretical scale over present usability.

## Practical instruction to future agents
If you are asked to work on backend, read `docs/backend-brief.md` first.
If you are asked to work on frontend, read `docs/frontend-brief.md` first.
If you are asked to make a strategic or architectural decision, read `docs/product-vision.md` first.
If the repository is still incomplete, prioritize establishing clean foundations rather than rushing into shallow feature sprawl.