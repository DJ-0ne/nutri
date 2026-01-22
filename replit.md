# NutriKenya - AI-Powered Nutrition Tracking App

## Overview

NutriKenya is a full-stack nutrition tracking application tailored for Kenyan lifestyles. It enables users to log meals using a local Kenyan food database, receive personalized AI-powered nutrition coaching, set daily reminders, and track their health goals. The app features a modern React frontend with an Express backend, PostgreSQL database, and integrates with Google Gemini and OpenAI for AI capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for nutrition data visualization
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based architecture with protected routes requiring authentication. Components are organized into UI primitives (`components/ui/`), shared components (`components/`), and page components (`pages/`).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth via OpenID Connect with Passport.js
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Design**: RESTful endpoints with Zod schema validation

The server uses a modular integration pattern where AI features (chat, audio, image, Gemini) are organized in `server/replit_integrations/` directories with their own routes, storage, and client modules.

### Database Schema
Core tables include:
- `users` and `sessions` - Authentication (required for Replit Auth)
- `profiles` - User health data (height, weight, goals, subscription tier)
- `foods` - Kenyan food database with nutritional information
- `mealLogs` - Daily meal entries with food items as JSONB
- `reminders` - Scheduled health reminders
- `conversations` and `messages` - AI chat history

Schema migrations are managed via Drizzle Kit with `db:push` command.

### Shared Code
The `shared/` directory contains:
- Database schema definitions used by both frontend and backend
- API route definitions with type-safe request/response schemas
- Type exports for consistent typing across the stack

## External Dependencies

### AI Services (via Replit AI Integrations)
- **Google Gemini**: Nutrition analysis and personalized recommendations (`AI_INTEGRATIONS_GEMINI_API_KEY`)
- **OpenAI**: Chat completions for AI coaching, voice transcription, and image generation (`AI_INTEGRATIONS_OPENAI_API_KEY`)

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- Uses Drizzle ORM for type-safe queries and migrations

### Authentication
- **Replit Auth**: OAuth/OIDC-based authentication
- Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables

### UI Libraries
- Full shadcn/ui component suite with Radix UI primitives
- Custom Tailwind theme with emerald green (health) and burnt orange (energy) color palette
- Google Fonts: Inter (body), Outfit (display)