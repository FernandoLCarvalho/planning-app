# Backend — Próximos passos

Este documento é um guia de continuidade para a próxima tarefa do backend.
Ele complementa `docs/backend-brief.md` com o estado atual da implementação.

## Estado atual
- Bootstrap NestJS + Fastify concluído.
- Swagger em `/docs`.
- `ValidationPipe` global ativo.
- `ConfigModule` global.
- `PrismaService` e `PrismaModule` globais.
- Schema Prisma completo com todos os modelos e enums do MVP.
- Migrações aplicadas: `20260418222033_init`, `20260418222456_add_refresh_token_hash`.
- `@prisma/client` gerado.
- `AuthModule` completo:
  - `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`
  - `JwtAuthGuard`, `@CurrentUser()` exportados e reutilizados por outros módulos
- `UsersModule` implementado:
  - `GET /users/me`
- `UserPreferencesModule` implementado:
  - `GET /users/me/preferences` — upsert on first access
  - `PUT /users/me/preferences` — valida enums, HH:mm, wake window ordering
- `WeeklyPlanningRequestsModule` implementado:
  - `POST /weekly-planning-requests` — cria request, userId vem do JWT
  - `GET /weekly-planning-requests/:id` — verifica ownership
  - `PUT /weekly-planning-requests/:id` — atualização parcial, verifica ownership
  - Validações condicionais via `@ValidateIf`:
    - `wantsStudy = true` → `studyTopics` (array, mínimo 1)
    - `wantsMealPlanning = true` → `mealsPerDay` (int >= 1) e `mealNames` (array, mínimo 1)
    - `trainingSessionsTarget` opcional, se presente deve ser >= 1

## Próximo passo recomendado
Implementar o schema Zod do AI planner e, em seguida, o módulo `weekly-plans`.

### ai-planner (schema e validador)
- Criar `AIPlannerResponseSchema` em Zod dentro de `modules/ai-planner/`.
- Cobrir: `planMetadata`, `dailyAnchors`, `blocks`, `actions`, `notes`, `warnings`.
- Criar `AIResponseValidatorService` que parseia e valida o output do modelo.
- Ver contrato completo em `docs/backend-brief.md §10`.

### weekly-plans (geração e leitura)
- `POST /weekly-plans/generate` — orquestra geração via AI planner.
- `GET /weekly-plans/current` — retorna o plano ativo mais recente.
- `GET /weekly-plans/:id` — retorna plano por id.
- `POST /weekly-plans/:id/confirm` — confirma um plano sugerido.
- `POST /weekly-plans/:id/reject` — rejeita um plano.
- `POST /weekly-plans/:id/replan` — gera nova versão a partir de urgência.

## Lembretes operacionais
- Importar `AuthModule` nos módulos que precisam de `JwtAuthGuard`.
- Controllers finos, services fortes.
- Usar `PrismaService` diretamente enquanto as queries forem simples.
- Zod apenas para contratos críticos internos (AI response).
- Transações nos fluxos de geração e replanejamento.
