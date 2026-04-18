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
- `AiPlannerModule` implementado:
  - `AIPlannerResponseSchema` — contrato Zod completo para o output do modelo
    - valida `planMetadata`, `dailyAnchors`, `blocks`, `actions`, `notes`, `warnings`
    - valida enums (DayOfWeek, AnchorType, ActivityType, Priority, Flexibility, EnergyDemand, ActionType)
    - valida formato HH:mm para campos de tempo
  - `AIResponseValidatorService` — parseia JSON raw, valida contra schema Zod, retorna resultado tipado
  - `AIPlannerService` — stub com resposta determinística; substitua `call()` pela integração real
  - `PlanningContextBuilderService` — skeleton que compila contexto (request + preferences)
  - `PromptAssemblerService` — skeleton que monta prompt a partir do contexto
- `WeeklyPlansModule` implementado:
  - `POST /weekly-plans/generate` — orquestra geração completa end-to-end
    - verifica ownership do `WeeklyPlanningRequest`
    - carrega `UserPreferences`
    - constrói contexto → monta prompt → chama AI → valida output
    - persiste `WeeklyPlan` + `WeeklyPlanDailyAnchor[]` + `PlannedBlock[]` + `PlanRevision` em uma transaction
    - retorna `WeeklyPlanReadModel` pronto para renderização

## Próximo passo recomendado
Substituir o `AIPlannerService` stub pela integração real com o Anthropic SDK e implementar os demais endpoints de `weekly-plans`.

### ai-planner — integração real
- Instalar `@anthropic-ai/sdk`.
- Implementar `AIPlannerService.call()` usando `anthropic.messages.create()`.
- Passar `systemPrompt` e `userPrompt` da `AssembledPrompt`.
- Capturar o output de texto da resposta e retornar como string raw para o validator.
- Registrar metadados de execução (provider, model, latência, tamanho do contexto).

### prompt-assembler — construção estruturada
- Expandir `PromptAssemblerService.assemble()` com o contexto completo:
  - preferências do usuário (energy pattern, training preference, sleep/wake window)
  - intenções da semana (workThisWeek, studyTopics, training target, meal planning)
  - instruções de formato JSON e enums aceitos

### weekly-plans — endpoints restantes
- `GET /weekly-plans/current` — plano ativo mais recente do usuário
- `GET /weekly-plans/:id` — plano por id, com ownership check
- `POST /weekly-plans/:id/confirm` — muda status para ACCEPTED, arquiva versões anteriores
- `POST /weekly-plans/:id/reject` — muda status para ARCHIVED

## Lembretes operacionais
- Importar `AuthModule` nos módulos que precisam de `JwtAuthGuard`.
- Controllers finos, services fortes.
- Usar `PrismaService` diretamente enquanto as queries forem simples.
- Zod apenas para contratos críticos internos (AI response).
- Transações nos fluxos de geração e replanejamento.
- Replanning (`POST /weekly-plans/:id/replan`) fica para depois dos endpoints básicos de leitura e confirmação.
