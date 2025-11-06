# Training Management Application

## Overview

A comprehensive training management system designed for consultants delivering AI and Product Management training programs. The application streamlines the entire training business workflow from client intake through proposal management, session scheduling, and invoicing. Built as a data-heavy enterprise application with a focus on efficiency, clarity, and professional aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Client-side code located in `client/` directory

**UI Component System**
- shadcn/ui component library (New York style variant) for consistent, accessible components
- Radix UI primitives as the foundation for complex interactive components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design/Carbon Design hybrid approach optimized for data-dense interfaces

**State Management**
- TanStack Query (React Query) for server state management, caching, and API synchronization
- Custom query client configuration with credential-based authentication
- React hooks for local component state

**Design System**
- Inter font family for all typography
- Custom color system with CSS variables supporting light/dark themes
- Responsive grid layouts with mobile-first breakpoints
- Consistent spacing scale using Tailwind units (4, 6, 8, 12, 16)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript with ES modules
- Session-based authentication with server-side session storage

**API Design**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Middleware for request logging and error handling
- Credential-based authentication flow

**Authentication & Authorization**
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js strategy for authentication middleware
- Session management with PostgreSQL session store (connect-pg-simple)
- User data synchronized with database on authentication

### Data Storage

**Database**
- PostgreSQL as the primary relational database
- Neon Serverless for cloud-hosted PostgreSQL with WebSocket support
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling via @neondatabase/serverless

**Schema Design**
- `users` table: Stores authenticated user profiles (id, email, name, profile image)
- `sessions` table: Server-side session storage with expiration handling
- `clients` table: Client company information and contact details
- `proposals` table: Training proposals with status tracking and amounts

**Migrations**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations` directory
- Schema definitions in `shared/schema.ts` using Drizzle's declarative syntax

### Application Structure

**Monorepo Layout**
- `client/`: Frontend React application
- `server/`: Backend Express application
- `shared/`: Shared TypeScript types and database schema
- Path aliases configured for clean imports (`@/`, `@shared/`)

**Key Pages**
- Dashboard: Overview with metrics, upcoming sessions, and activity feed
- Clients: Client management with search and filtering
- Proposals: Proposal tracking with status-based views
- Sessions: Training session calendar and management
- Invoices: Invoice generation and payment tracking

**Reusable Components**
- Card-based layouts for displaying entities (ClientCard, ProposalCard, SessionCard, InvoiceCard)
- StatCard for dashboard metrics
- ActivityFeed for recent system activity
- StatusBadge for visual status indicators
- AppSidebar for persistent navigation

## External Dependencies

### Third-Party Services

**Authentication**
- Replit Auth (OpenID Connect provider)
- Issuer URL: `https://replit.com/oidc` (configurable via environment)
- Required environment variables: `REPL_ID`, `SESSION_SECRET`, `ISSUER_URL`

**Database**
- Neon Serverless PostgreSQL
- Required environment variable: `DATABASE_URL`
- WebSocket support via `ws` package

### Key NPM Packages

**UI & Styling**
- `@radix-ui/*`: Accessible component primitives (20+ packages)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe component variant management
- `lucide-react`: Icon library

**Data & Forms**
- `@tanstack/react-query`: Server state management
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form validation with Zod integration
- `zod`: Schema validation
- `drizzle-zod`: Drizzle to Zod schema conversion

**Backend**
- `express`: Web server framework
- `passport`: Authentication middleware
- `openid-client`: OpenID Connect client with Passport strategy
- `connect-pg-simple`: PostgreSQL session store
- `drizzle-orm`: Type-safe ORM

**Developer Experience**
- `@replit/vite-plugin-*`: Replit-specific development plugins (runtime error overlay, cartographer, dev banner)
- `tsx`: TypeScript execution for development
- `esbuild`: Fast TypeScript compilation for production builds

### Build & Deployment

**Development**
- Vite dev server with HMR
- Express server with automatic TypeScript execution via `tsx`
- Concurrent frontend and backend development

**Production Build**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.js` as ES module
- Static file serving from built client directory