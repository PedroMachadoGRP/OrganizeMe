# OrganizeMe

Aplicação full-stack de gerenciamento de tarefas. Cada usuário cria, acompanha e conclui suas próprias tarefas, com prazos de expiração e um job automático que marca tarefas vencidas como `EXPIRED`.

- **Backend:** Node.js + Express + TypeScript + Prisma (PostgreSQL) + Redis (Upstash)
- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Rodando o projeto](#rodando-o-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Autenticação e segurança](#autenticação-e-segurança)
- [Modelo de dados](#modelo-de-dados)
- [Referência da API](#referência-da-api)
- [Job de expiração automática](#job-de-expiração-automática)

---

## Funcionalidades

- Cadastro e login de usuários com senha forte obrigatória (maiúscula, minúscula, número e símbolo).
- Sessão baseada em **access token** (JWT, 15 min) + **refresh token** (7 dias, rotacionado a cada uso).
- Criação, edição, conclusão e remoção de tarefas.
- Bloqueio de criação/edição de tarefas com data de expiração no passado.
- Expiração automática: um job roda a cada minuto e move tarefas `IN_PROGRESS` vencidas para `EXPIRED`.
- Painel de resumo com total de tarefas, tarefas em progresso e tarefas que vencem hoje.
- Busca e filtro de tarefas por título/descrição.
- Proteção CSRF em todas as rotas de mutação (`POST`/`PUT`/`PATCH`/`DELETE`).
- Rate limiting global via Redis (Upstash).

## Arquitetura

```
┌─────────────────┐        HTTPS + cookies        ┌──────────────────┐
│   Frontend       │ ─────────────────────────────▶│    Backend       │
│   Next.js        │◀───────────────────────────── │   Express API    │
└─────────────────┘                                └──────────────────┘
                                                          │        │
                                                          ▼        ▼
                                                    PostgreSQL   Redis
                                                     (Prisma)   (Upstash)
```

A autenticação é 100% baseada em cookies `httpOnly` (o frontend nunca lê tokens diretamente); o backend também expõe um cookie `csrf-token` legível por JS para o padrão *double submit cookie*.

## Stack técnica

### Backend
| Camada | Tecnologia |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework HTTP | Express 5 |
| ORM | Prisma 7 (PostgreSQL) |
| Cache / Rate limit | Redis via `@upstash/redis` + `@upstash/ratelimit` |
| Autenticação | JWT assinado com RS256 (`jose`) + refresh token opaco |
| Validação | Zod |
| Jobs agendados | `node-cron` |
| Segurança | `helmet`, CSRF customizado, `bcryptjs` |

### Frontend
| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Componentes | Radix UI (`radix-ui`, `@radix-ui/themes`) |
| Notificações | `notistack` |
| Ícones | `lucide-react`, `@radix-ui/react-icons` |

## Pré-requisitos

- Node.js 22+
- PostgreSQL rodando localmente (ou uma connection string de um provedor)
- Uma conta/instância Redis compatível com a API REST da Upstash

## Configuração do ambiente

### 1. Backend — `backend/.env`

```dotenv
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/organizeme"

# JWT — par de chaves RS256
# Gerar com:
#   openssl genrsa -out private.pem 2048
#   openssl rsa -in private.pem -pubout -out public.pem
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://<sua-instancia>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="<seu-token>"

# CORS — domínio(s) do frontend, separados por vírgula
ALLOWED_ORIGINS="http://localhost:3000"

PORT=3001
NODE_ENV="development"
BCRYPT_SALT_ROUNDS=10
```

> ⚠️ **Nunca commite o `.env` com segredos reais.** As chaves acima são placeholders — gere as suas próprias e mantenha o arquivo fora do controle de versão.

### 2. Frontend — `frontend/.env.local`

```dotenv
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Rodando o projeto

### Backend

```bash
cd backend
npm install
npm run db:migrate     # aplica as migrations no banco
npm run dev             # inicia a API em modo watch (porta 3001)
```

Scripts disponíveis:

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe a API com hot-reload (`ts-node-dev`) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Compila e roda a versão de produção |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:migrate` | Cria/aplica migrations (ambiente de dev) |
| `npm run db:seed` | Popula o banco com dados iniciais |

### Frontend

```bash
cd frontend
npm install
npm run dev              # inicia o Next.js em http://localhost:3000
```

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe o app em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Roda o build de produção |
| `npm run lint` | Executa o ESLint |

## Estrutura de pastas

```
OrganizeMe/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Modelos: User, Task, Session
│   └── src/
│       ├── controllers/         # Camada HTTP (req/res)
│       ├── services/            # Regras de negócio e acesso ao Prisma
│       ├── routes/               # Definição das rotas Express
│       ├── schemas/              # Validação de entrada com Zod
│       ├── middleware/           # Auth, CSRF, rate limit, validação, erros
│       ├── jobs/                 # Job de expiração automática (cron)
│       ├── lib/                  # Clientes (Prisma, Redis)
│       ├── app.ts                # Configuração do Express (middlewares globais)
│       └── server.ts             # Bootstrap: conecta DB, sobe HTTP, inicia jobs
└── frontend/
    └── app/
        ├── (auth)/                # Páginas de login/registro
        ├── tasks/                 # Página principal de tarefas
        ├── history/                # Histórico de tarefas concluídas/canceladas/expiradas
        ├── components/             # Componentes de UI (TaskCard, modais, etc.)
        ├── contexts/                # AuthContext (estado global de sessão)
        ├── hooks/                    # useTasks, useAuth
        └── lib/                       # Cliente HTTP (api-client.ts) e tipos
```

## Autenticação e segurança

### Fluxo de sessão

1. **Login** (`POST /auth/login`) valida credenciais e emite dois cookies `httpOnly`:
   - `accessToken` — JWT RS256, expira em 15 minutos, enviado em todas as requisições.
   - `refresh-token` — token opaco aleatório, expira em 7 dias, escopado ao path `/auth/refresh`. Seu hash (SHA-256) fica salvo na tabela `Session`.
2. Quando o `accessToken` expira, uma requisição autenticada recebe `401`. O cliente HTTP do frontend chama `POST /auth/refresh` automaticamente; o backend valida o hash do refresh token contra a `Session`, **rotaciona** o token (invalida o antigo e emite um novo par) e retorna novos cookies.
3. Se o refresh falhar (token inválido/expirado), o usuário é redirecionado para `/login`.
4. **Logout** (`POST /auth/logout`) revoga o access token atual (blacklist no Redis) e limpa os cookies.

### CSRF

Toda rota de mutação (`POST`/`PUT`/`PATCH`/`DELETE`, exceto `GET /auth/csrf-token`) exige o header `X-CSRF-Token`, que deve bater com o cookie `csrf-token` (legível por JS, *double submit cookie*). O frontend busca esse token automaticamente antes da primeira mutação.

### Outras proteções

- `helmet` com CSP restritiva e HSTS.
- Rate limiting global (30 requisições/minuto por IP) via Redis.
- Senhas com `bcryptjs`, comparação com hash dummy para evitar *timing attacks* em e-mails inexistentes.
- Todas as consultas de tarefas são escopadas por `userId` — um usuário nunca acessa dados de outro.

## Modelo de dados

```prisma
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  tasks        Task[]
  sessions     Session[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  expiresAt   DateTime
  status      TaskStatus @default(IN_PROGRESS)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum TaskStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
  EXPIRED
}
```

## Referência da API

Base URL: `http://localhost:3001`

### Autenticação (`/auth`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/auth/csrf-token` | — | Gera e retorna o token CSRF (também setado em cookie) |
| `POST` | `/auth/register` | — | Cria um novo usuário |
| `POST` | `/auth/login` | — | Autentica e inicia a sessão |
| `POST` | `/auth/refresh` | Cookie `refresh-token` | Renova a sessão (rotaciona os tokens) |
| `POST` | `/auth/logout` | Cookie `accessToken` | Encerra a sessão |
| `GET` | `/auth/me` | Cookie `accessToken` | Retorna o usuário autenticado |

**`POST /auth/register`**
```json
{
  "name": "Maria Silva",
  "email": "maria@exemplo.com",
  "password": "Senha@123"
}
```

**`POST /auth/login`**
```json
{
  "email": "maria@exemplo.com",
  "password": "Senha@123"
}
```

### Tarefas (`/tasks`)

Todas as rotas exigem cookie `accessToken` válido.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tasks?filter=IN_PROGRESS` | Lista as tarefas do usuário. `filter` é opcional (`IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `EXPIRED`) |
| `POST` | `/tasks` | Cria uma tarefa |
| `PUT` | `/tasks/:id` | Atualiza título, descrição e/ou prazo |
| `PATCH` | `/tasks/:id/complete` | Marca a tarefa como `COMPLETED` |
| `DELETE` | `/tasks/:id` | Remove a tarefa |

**`POST /tasks`**
```json
{
  "title": "Estudar para a prova",
  "description": "Capítulos 3 a 5",
  "expiresAt": "2026-08-20T23:59:00.000Z"
}
```
> `expiresAt`, se enviado, deve ser uma data/hora **futura** — a API rejeita (`422`) tarefas criadas ou editadas com prazo no passado.

**Resposta de erro de validação (422)**
```json
{
  "message": "Dados Inválidos",
  "errors": [
    { "field": "expiresAt", "message": "A data de expiração deve ser posterior à data atual" }
  ]
}
```

## Job de expiração automática

`backend/src/jobs/expireTasks.ts` roda a cada minuto (via `node-cron`) e executa, no banco, um `updateMany` que move todas as tarefas com `status = IN_PROGRESS` e `expiresAt` no passado para `status = EXPIRED`. O job é iniciado junto com o servidor em `server.ts`, então não requer nenhum processo ou infraestrutura externa — funciona enquanto a API estiver de pé.
