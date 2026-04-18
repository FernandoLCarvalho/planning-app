# Backend — Próximos passos

Este documento é um guia de continuidade para a próxima tarefa do backend.
Ele complementa `docs/backend-brief.md` com o estado atual da implementação.

## Estado atual
- Bootstrap NestJS + Fastify concluído.
- Swagger em `/docs` (requer `@fastify/static`, já instalado).
- `ValidationPipe` global ativo.
- `ConfigModule` global.
- `PrismaService` e `PrismaModule` globais.
- Schema Prisma completo com todos os modelos e enums do MVP.
- Migrações aplicadas: `20260418222033_init`, `20260418222456_add_refresh_token_hash`.
- `@prisma/client` gerado.
- `AuthModule` completo e testado:
  - `POST /auth/register` — bcrypt hash, cria User, retorna tokens
  - `POST /auth/login` — valida credenciais, retorna tokens
  - `POST /auth/refresh` — verifica refresh token, rotaciona par
  - `GET /auth/me` — requer `Authorization: Bearer <accessToken>`
  - `JwtStrategy`, `JwtAuthGuard`, `@CurrentUser()` prontos para reutilização
- `JwtAuthGuard` e `AuthService` exportados para uso em outros módulos.
- `UsersModule` implementado:
  - `GET /users/me` — retorna dados básicos do usuário autenticado.
- `UserPreferencesModule` implementado:
  - `GET /users/me/preferences` — upsert on first access (cria defaults se não existir).
  - `PUT /users/me/preferences` — valida e persiste preferências completas.
  - DTO com validações: enums, `HH:mm` regex, wake window ordering no service.

## Próximo passo recomendado
Implementar o módulo `weekly-planning-requests`.

### weekly-planning-requests
- `POST /weekly-planning-requests` — cria um novo request com DTO completo.
- `GET /weekly-planning-requests/:id` — retorna um request específico.
- `PUT /weekly-planning-requests/:id` — atualiza um request existente.
- DTO conforme `docs/backend-brief.md §9` (`CreateWeeklyPlanningRequestDto`).
- Validações condicionais:
  - se `wantsStudy = true`, `studyTopics` deve existir e ter ao menos um item;
  - se `wantsMealPlanning = true`, `mealsPerDay` e `mealNames` devem existir;
  - se `trainingSessionsTarget` existir, deve ser `>= 1`.
- Pertence ao usuário autenticado (`userId` do JWT, não do body).

Após `weekly-planning-requests`, a ordem é:
1. `ai-planner` — criar `AIPlannerResponseSchema` em Zod.
2. `weekly-plans` — geração, current, confirm.

## Lembretes operacionais
- Importar `AuthModule` nos módulos que precisam de `JwtAuthGuard`.
- Controllers finos, services fortes.
- Usar `PrismaService` diretamente enquanto as queries forem simples.
- Zod apenas para contratos críticos internos (AI response).
- Transações nos fluxos de geração e replanejamento.
