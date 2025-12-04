# Saúde+ - Sistema de Gerenciamento de Consultas

Sistema de agendamento de consultas médicas entre pacientes e médicos, com painel administrativo para gestão completa.

## Requisitos de Ambiente

### Versões Necessárias

- **Node.js:** >= 18.0.0
- **pnpm:** 9.0.0 ou superior
- **Docker:** Para o banco de dados PostgreSQL
- **Docker Compose:** (opcional) Para gerenciar containers

### Stack Tecnológico

- **Monorepo:** Turborepo
- **API (Backend):**
  - Fastify
  - Prisma ORM
  - PostgreSQL
  - JWT Authentication
  - Zod (validação)
- **Web (Frontend):**
  - React 18
  - Vite
  - React Router v6
  - TanStack Query (React Query)
  - Radix UI + Tailwind CSS
  - Axios
- **Testes:**
  - Vitest
  - Supertest

## Estrutura do Projeto

```
apps/
  api/           - API REST com Fastify
  web/           - Frontend React com Vite
packages/
  integration-tests/  - Testes de integração com Vitest
```

## Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd saude
```

### 2. Instalar Dependências

```bash
# Instalar pnpm globalmente (se necessário)
npm install -g pnpm@9

# Instalar dependências do projeto
pnpm install
```

### 3. Configurar Banco de Dados (PostgreSQL com Docker)

#### Iniciar PostgreSQL com Docker

```bash
# Criar e iniciar container PostgreSQL
docker run --name saude-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saude \
  -p 5432:5432 \
  -d postgres:15

# Verificar se o container está rodando
docker ps
```

#### Parar e Reiniciar o Container (quando necessário)

```bash
# Parar o container
docker stop saude-postgres

# Iniciar o container novamente
docker start saude-postgres

# Remover o container (se necessário recriá-lo)
docker rm saude-postgres
```

### 4. Configurar Variáveis de Ambiente

#### API (`apps/api/.env`)

Crie o arquivo `.env` dentro de `apps/api/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saude?schema=public"
JWT_SECRET="seu-segredo-jwt-aqui-altere-em-producao"
```

**Importante:**

- Altere `JWT_SECRET` para um valor seguro em produção
- Ajuste as credenciais do PostgreSQL conforme sua configuração

#### Web (`apps/web/.env`)

Não é necessário criar arquivo `.env` para o frontend. A URL da API está configurada em `apps/web/src/services/api.ts` como `http://localhost:3001`.

### 5. Preparar o Banco de Dados

```bash
cd apps/api

# Gerar o Prisma Client
npx prisma generate

# Executar migrations (criar tabelas)
npx prisma migrate dev

# Seed do banco de dados (dados iniciais)
npx prisma db seed

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

### 6. Executar o Sistema

#### Modo Desenvolvimento (Todos os Apps)

```bash
# Voltar para a raiz do projeto
cd ../..

# Iniciar API e Web simultaneamente
pnpm dev
```

#### Executar Apps Individualmente

```bash
# Apenas a API (porta 3001)
turbo dev --filter=@saude/api

# Apenas o Web (porta 5173)
turbo dev --filter=web
```

#### Acessar o Sistema

- **Frontend:** <http://localhost:5173>
- **API:** <http://localhost:3001>
- **Prisma Studio:** <http://localhost:5555> (quando executado)

### 7. Build para Produção

```bash
# Build de todos os apps
pnpm build

# Build individual
turbo build --filter=web
turbo build --filter=@saude/api

# Build do Web para ambiente de desenvolvimento
cd apps/web && pnpm build:dev
```

## Comandos Úteis

### Desenvolvimento

```bash
# Verificação de tipos
pnpm check-types

# Lint
pnpm lint

# Formatação de código
pnpm format
```

### Banco de Dados

```bash
cd apps/api

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Visualizar dados no Prisma Studio
npx prisma studio
```

### Testes

```bash
cd packages/integration-tests

# Executar todos os testes
pnpm test

# Testes em modo watch
pnpm test:watch
```

## Usuários Padrão (Após Seed)

Após executar o seed do banco de dados, os seguintes usuários estarão disponíveis:

- **Admin:** email definido no seed
- **Médico:** email definido no seed
- **Paciente:** email definido no seed

Consulte o arquivo de seed em `apps/api/prisma/seed.ts` para ver as credenciais padrão.

## Estrutura de Rotas

### API (Backend)

**Rotas Públicas:**

- `POST /auth/signin` - Login
- `POST /auth/signup` - Cadastro
- `GET /doctors` - Listar médicos

**Rotas Privadas (requerem autenticação JWT):**

- `/appointments` - Gerenciamento de consultas
- `/patients` - Operações de pacientes
- `/doctors` - Operações de médicos (bloqueio de agenda, disponibilidade)
- `/admin` - Operações administrativas (CRUD completo)

### Web (Frontend)

- `/` - Página de autenticação (login/cadastro)
- `/agendar` - Agendamento de consultas (paciente)
- `/minhas-consultas` - Visualização de consultas (paciente)
- `/agenda-medico` - Agenda do médico
- `/admin` - Painel administrativo

## Permissões e Roles

O sistema possui 3 tipos de usuários:

- **admin:** Acesso total ao sistema
- **doctor:** Gerenciamento de agenda e consultas
- **patient:** Agendamento e visualização de consultas

## Troubleshooting

### Erro de conexão com banco de dados

Verifique se:

1. O container Docker PostgreSQL está rodando: `docker ps`
2. A `DATABASE_URL` no `.env` está correta
3. A porta 5432 não está sendo usada por outro processo

### Erro no Prisma Client

```bash
cd apps/api
npx prisma generate
```

### Porta já em uso

Se as portas 3001 (API) ou 5173 (Web) já estiverem em uso:

- Identifique o processo: `lsof -i :3001` ou `lsof -i :5173`
- Encerre o processo ou altere a porta no código

## Documentação Adicional

Para mais detalhes sobre a arquitetura e padrões de desenvolvimento, consulte o arquivo `CLAUDE.md` na raiz do projeto.
