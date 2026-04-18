# Frontend Brief — Personal Adaptive Planner v1

## 1. Objective
Build the mobile-first frontend MVP for Personal Adaptive Planner as a React Native app with Expo.

The frontend must support:
- weekly planning;
- urgency-based replanning;
- manual block editing;
- quick weekly reading;
- recurring personal use on iPhone.

The experience must prioritize:
- low friction;
- visual clarity;
- fast navigation;
- simple forms;
- non-invasive UX.

## 2. Official frontend stack
- React Native
- Expo
- Expo Router
- TypeScript
- TanStack Query
- React Hook Form
- Zod
- date-fns
- Zustand only if truly necessary for light global state

Initial usage strategy:
- start with Expo Go for rapid validation of flow and UI;
- move to a development build when the app needs more native behavior and sustained personal use.

## 3. UX principles
- mobile-first;
- few primary screens;
- minimal taps;
- progressive and conditional forms;
- clean visual hierarchy;
- avoid moralistic or overly controlling tone;
- optimize for adaptation and lightness.

## 4. Primary navigation
Expected main routes:
- `/login`
- `/onboarding/preferences`
- `/home`
- `/planning/new`
- `/planning/current`
- `/planning/[id]`
- `/planning/[id]/replan`
- `/blocks/[id]/edit`
- `/settings/preferences`

Primary user flow:
1. user enters the app;
2. user configures initial preferences;
3. user creates weekly intent;
4. user generates a plan;
5. user views the week;
6. user adjusts blocks if needed;
7. user uses urgency flow when life changes.

## 5. Main MVP screens
### Login
Purpose:
- simple authentication.

### Onboarding Preferences
Purpose:
- collect persistent planning preferences.

Main fields:
- planning style;
- notification tolerance;
- preferred training time;
- energy pattern;
- preferred sleep time;
- preferred wake window;
- default meals.

### Home
Purpose:
- main entry point;
- quick access to the current plan;
- quick access to create a new week;
- quick access to replanning.

### New Weekly Planning
Purpose:
- dynamic weekly planning form.

Main fields:
- work this week?;
- want training?;
- how many sessions?;
- want study?;
- which topics?;
- want spouse activity?;
- want meal planning?;
- free-form notes.

### Current Week
Purpose:
- show the weekly plan;
- show anchors and blocks;
- allow confirmation;
- allow block edit;
- allow opening urgency replanning.

### Urgency Replanning
Purpose:
- collect free-form disruption context;
- trigger replanning.

Main fields:
- urgency level;
- replanning mode;
- free-form message.

### Block Edit
Purpose:
- update time;
- update title and description;
- update priority;
- mark as completed or skipped.

### Preferences
Purpose:
- edit `UserPreferences`.

## 6. Preferred frontend structure

```text
apps/mobile/
  src/
    app/
      (auth)/
        login.tsx

      (onboarding)/
        preferences.tsx

      (tabs)/
        home.tsx
        planning/
          new.tsx
          current.tsx
          [id].tsx
          [id]/replan.tsx
        settings/
          preferences.tsx

      blocks/
        [id]/edit.tsx

    components/
      ui/
      layout/
      forms/
      planning/
      blocks/
      feedback/

    features/
      auth/
        api/
        hooks/
        types/

      user-preferences/
        api/
        hooks/
        forms/
        types/
        schemas/

      weekly-planning-requests/
        api/
        hooks/
        forms/
        types/
        schemas/

      weekly-plans/
        api/
        hooks/
        components/
        types/

      planned-blocks/
        api/
        hooks/
        forms/
        types/

      replan/
        api/
        hooks/
        forms/
        types/
        schemas/

    lib/
      api/
        client.ts
        query-client.ts
      utils/
      constants/

    stores/
    theme/
    types/
```

## 7. Frontend architecture rules
- Keep route files under `src/app`.
- Keep domain logic under `src/features`.
- Keep reusable shared components under `src/components`.
- Keep API infrastructure under `src/lib/api`.
- Do not put business logic directly into screens.
- Screens should orchestrate layout, flow, and hooks.
- Keep form-specific logic near the feature when it is feature-owned.
- Prefer feature-based organization over generic folders with mixed concerns.

## 8. Data strategy
### Server state
Use TanStack Query for:
- fetching user preferences;
- fetching current plan;
- fetching plan blocks;
- submitting plan generation;
- submitting replanning;
- invalidating queries after mutations.

### Form state
Use React Hook Form + Zod for:
- preferences;
- weekly planning request;
- urgency replanning;
- block editing.

### Global state
Avoid global state early.
Use Zustand only if there is a real cross-screen need, for example:
- simplified session state;
- small UI preferences;
- a light transversal flow that does not fit Query or local state.

## 9. API client strategy
Create one central HTTP client.

Expected responsibilities:
- environment-based base URL;
- automatic auth header when available;
- basic error normalization;
- `get`, `post`, `patch`, and `delete` helpers.

Initial API surface:
- `/auth/*`
- `/users/me/preferences`
- `/weekly-planning-requests`
- `/weekly-plans/*`
- `/planned-blocks/*`

## 10. Main queries and mutations
### Auth
- `useLoginMutation`
- `useMeQuery`

### Preferences
- `useUserPreferencesQuery`
- `useUpdateUserPreferencesMutation`

### Weekly Planning Requests
- `useCreateWeeklyPlanningRequestMutation`
- `useUpdateWeeklyPlanningRequestMutation`
- `useWeeklyPlanningRequestQuery`

### Weekly Plans
- `useCurrentWeeklyPlanQuery`
- `useWeeklyPlanQuery`
- `useGenerateWeeklyPlanMutation`
- `useConfirmWeeklyPlanMutation`
- `useRejectWeeklyPlanMutation`
- `useReplanWeeklyPlanMutation`

### Planned Blocks
- `useWeeklyPlanBlocksQuery`
- `useUpdatePlannedBlockMutation`
- `useCompletePlannedBlockMutation`
- `useSkipPlannedBlockMutation`

## 11. Main UI components
### Layout and structure
- `ScreenContainer`
- `SectionCard`
- `EmptyState`
- `LoadingState`
- `ErrorState`

### Forms
- `FormTextField`
- `FormSelect`
- `FormSwitch`
- `FormTimeField`
- `ProgressiveQuestionBlock`

### Planning
- `WeeklyPlanHeader`
- `DailyAnchorRow`
- `PlannedBlockCard`
- `WeeklyTimeline`
- `PlanNotesCard`
- `WarningsCard`

### Replan
- `UrgencySelector`
- `ReplanModeSelector`
- `ReplanMessageField`

## 12. Weekly screen behavior
The weekly screen must show:
- plan summary such as `strategy` and `reasoningSummary`;
- daily anchors;
- blocks grouped by day;
- clear block status;
- quick action to edit a block;
- quick action to complete or skip a block;
- a clearly visible action to replan.

Rendering must stay simple in the MVP.
Do not attempt a full complex calendar experience first.

Recommendation:
start with a day-by-day list, not drag-and-drop calendar UI.

## 13. Visual strategy
Do not build a heavy design system in v1.

Prioritize:
- simple custom components;
- consistent spacing;
- clear cards;
- readable typography;
- low visual noise.

Desired emotional tone:
- useful;
- calm;
- intelligent;
- discreet.

Avoid making the app feel:
- aggressive;
- overly gamified;
- controlling;
- excessively corporate.

## 14. Frontend behavior rules
- Optimize for frequent personal use on iPhone.
- Keep the app fast to navigate.
- Prefer progressive disclosure over giant screens.
- Keep forms conditional when useful.
- Keep error states understandable and low-friction.
- Favor stable UI patterns over clever interactions.
- Do not over-abstract early.
- Do not introduce heavy UI libraries unless explicitly requested.

## 15. Contracts expected from backend
The frontend assumes backend responses align with the documented MVP, especially:
- authenticated user endpoints;
- `UserPreferences` shape;
- `WeeklyPlanningRequest` creation and retrieval;
- `WeeklyPlanReadModel` for current and specific plans;
- planned block update actions;
- replanning result returning a coherent plan version.

The frontend should consume render-ready weekly data rather than reconstructing the week manually from fragmented raw tables.

## 16. Form strategy by screen
### Preferences form
Use RHF + Zod for:
- enum-like fields;
- time strings;
- wake window validation;
- meal defaults.

### Weekly planning form
Use progressive sections and conditional fields.

Examples:
- only ask `studyTopics` if `wantsStudy = true`;
- only ask `mealsPerDay` and `mealNames` if `wantsMealPlanning = true`;
- keep notes optional.

### Replan form
Validate:
- urgency level;
- replanning mode;
- non-empty meaningful message.

### Block edit form
Validate:
- time format;
- logical start/end ordering;
- allowed status and priority values.

## 17. Initial implementation order
1. bootstrap Expo + Expo Router + TypeScript;
2. create the folder structure;
3. create the central API client;
4. add auth basics;
5. implement onboarding/preferences;
6. implement weekly planning form;
7. implement generate plan mutation;
8. implement current week screen;
9. implement block edit screen;
10. implement urgency replanning flow;
11. refine visual consistency.

## 18. Coding rules for frontend work
- Maintain organization by feature.
- Keep names explicit and semantic.
- Prefer small composable components.
- Avoid scattering domain logic across screens.
- Do not create global state without a real need.
- Prefer readability over clever patterns.
- Keep the MVP simple.
- Choose the lightest solution that supports the documented experience.

## 19. Immediate goal
Generate the frontend foundation in `apps/mobile` with:
- Expo Router configured;
- feature-based folder structure;
- API client;
- TanStack Query setup;
- RHF + Zod form foundation;
- initial MVP screens;
- integration points for the main backend endpoints.