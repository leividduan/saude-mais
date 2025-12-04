# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a healthcare appointment management system ("Saúde+") built as a Turborepo monorepo. The system handles appointment scheduling between patients and doctors, with administrative oversight.

**Tech Stack:**
- **API:** Fastify + Prisma + PostgreSQL
- **Web:** React + Vite + React Router + TanStack Query
- **Monorepo:** Turborepo + pnpm
- **Package Manager:** pnpm 9.0.0
- **Node:** >=18

## Repository Structure

```
apps/
  api/           - Fastify REST API backend
  web/           - React frontend (Vite)
packages/
  integration-tests/  - Vitest integration tests
```

## Common Commands

### Development
```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
turbo dev --filter=web
turbo dev --filter=@saude/api

# API dev server (with watch mode)
cd apps/api && pnpm dev
```

### Building
```bash
# Build everything
pnpm build

# Build specific app
turbo build --filter=web
turbo build --filter=@saude/api

# Build web for development environment
cd apps/web && pnpm build:dev
```

### Code Quality
```bash
# Lint all packages
pnpm lint

# Type checking across monorepo
pnpm check-types

# Format code
pnpm format
```

### Database (API)
```bash
cd apps/api

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### Testing
```bash
cd packages/integration-tests

# Run all integration tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Architecture

### API Architecture

**Entry Point:** `apps/api/src/index.ts`
- Fastify server on port 3001
- JWT authentication via `@fastify/jwt` (5h expiration)
- CORS enabled for development
- Global Zod error handling

**Route Structure:** Routes are split into public and private via `apps/api/src/routes/index.ts`
- **Public routes:**
  - `/auth` - Authentication (signin/signup)
  - `/doctors` - Public doctor listings
- **Private routes:** (require JWT via `authenticationMiddleware`)
  - `/appointments` - Appointment management
  - `/patients` - Patient operations
  - `/doctors` - Doctor operations (schedule blocking, availability)
  - `/admin` - Admin operations (CRUD for doctors, patients, health insurance, reports)

**Controllers:** Located in `apps/api/src/controllers/`, organized by domain:
- `auth/` - SignIn/SignUp
- `appointment/` - Create/Cancel appointments
- `doctor/` - List doctors, availability, agenda, schedule blocking
- `patient/` - Patient profile operations
- `admin/` - Admin CRUD operations for all entities

**Middleware:**
- `authenticationMiddleware.ts` - JWT verification, attaches decoded user to request
- `adminMiddleware.ts` - Role-based access control for admin routes

**Database:** Prisma with PostgreSQL, schema split across multiple files in `apps/api/prisma/`:
- `user.prisma` - Base user model with role (admin/doctor/patient)
- `patient.prisma` - Patient profile (extends User, has CPF, phone, health insurance)
- `doctor.prisma` - Doctor profile (extends User, has CRM, specialty)
- `appointment.prisma` - Appointment model
- `schedule_block.prisma` - Doctor schedule blocking
- `health_insurance.prisma` - Health insurance plans
- `schema.prisma` - Main schema file that imports others

**Prisma Client:** Generated to `apps/api/generated/prisma/` (custom output path)

### Web Architecture

**Entry Point:** `apps/web/src/main.tsx` → `App.tsx`

**Routing:** React Router v6 with role-based route protection
- `/` - Auth page (login/signup)
- `/agendar` - Patient appointment booking (requires patient role)
- `/minhas-consultas` - Patient's appointments view (requires patient role)
- `/agenda-medico` - Doctor's agenda/schedule (requires doctor role)
- `/admin` - Admin dashboard (requires admin role)

**Authentication:** `AuthContext` (`apps/web/src/contexts/AuthContext.tsx`)
- JWT stored in localStorage with key `token`
- User object stored in localStorage with key `user`
- Axios interceptor automatically adds Bearer token to all requests
- Three user roles: `admin`, `doctor`, `patient`

**Route Protection:**
- `AuthGuard` - Redirects based on authentication state
- `ProtectedRoute` - Enforces role-based access control

**API Client:** `apps/web/src/services/api.ts`
- Axios instance pointing to `http://localhost:3001`
- JWT token automatically attached via interceptor

**State Management:**
- TanStack Query (React Query) for server state
- React Context for authentication
- Component local state for UI

**Components:**
- `apps/web/src/components/ui/` - Radix UI components (shadcn/ui style)
- `apps/web/src/components/appointment/` - Appointment-specific components
- `apps/web/src/components/admin/` - Admin panel components
- `apps/web/src/components/medico/` - Doctor-specific components
- `apps/web/src/components/layout/` - Layout components

### Integration Tests

Located in `packages/integration-tests/`, using Vitest and Supertest. Tests are organized by domain:
- `auth/` - Authentication flows
- `patient/` - Patient operations
- `doctor/` - Doctor operations
- `admin/` - Admin operations
- `setup/` - Test setup and utilities
- `helpers.ts` - Test helper functions

## Environment Variables

**API (`apps/api/`):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing

**Web (`apps/web/`):**
- API baseURL is hardcoded to `http://localhost:3001` in `services/api.ts`

## Key Implementation Patterns

### Adding a New Controller
1. Create controller in `apps/api/src/controllers/{domain}/{Action}Controller.ts`
2. Export handler function that accepts `(fastify, request, reply)`
3. Use Zod for request validation
4. Register route in appropriate file under `apps/api/src/routes/`

### Adding a New Route
1. Define route in domain-specific file in `apps/api/src/routes/`
2. Attach middleware if needed (auth, admin)
3. Public routes go in `publicRoutes`, protected routes in `privateRoutes`

### Adding Database Models
1. Create/modify `.prisma` files in `apps/api/prisma/`
2. Main `schema.prisma` imports the model files
3. Run `npx prisma migrate dev` to create migration
4. Run `npx prisma generate` to update Prisma client
5. Prisma client is imported from custom path: `../generated/prisma`

### Adding a New Page (Web)
1. Create page component in `apps/web/src/pages/`
2. Add route in `App.tsx`
3. Wrap with appropriate guards (`AuthGuard`, `ProtectedRoute`)
4. Use TanStack Query for data fetching

### Role-Based Access
- Backend: Use `adminMiddleware` or check `request.user.role`
- Frontend: Use `ProtectedRoute` component with `roles` prop
- Available roles: `admin`, `doctor`, `patient`
