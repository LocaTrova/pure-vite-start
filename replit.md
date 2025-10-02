# Locatrova Landing Page

## Overview

Locatrova is a platform that connects property owners with creative productions and events, operating as an "Airbnb for film shoots and events." The application features a conversion-optimized landing page with a multi-step registration form, designed to onboard property owners who want to monetize their spaces for creative productions, photo shoots, and events.

The platform targets property owners with various space types (homes, villas, offices, industrial spaces, creative studios, outdoor locations) and aims to convert them into active listings through an intuitive, mobile-first user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation

**Design System:**
- Custom color palette with primary orange (#FF6B35), secondary orange, dark navy, and neutral grays
- Airbnb-inspired design patterns focused on conversion optimization
- Typography using Inter/Poppins fonts from Google Fonts
- Consistent spacing scale based on Tailwind units (8px base unit)
- Responsive breakpoints with mobile-first approach

**Component Architecture:**
- Modular section-based components (Hero, ClientLogos, HowItWorks, CaseStudy, SpaceTypes, MultiStepForm, FAQ, FooterCTA)
- Reusable UI primitives in `components/ui/` directory
- Centralized navigation with smooth scroll-to-section functionality
- Form state managed locally with progressive disclosure pattern

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Development server integrated with Vite middleware for HMR
- RESTful API pattern (though currently minimal backend logic)

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) for development
- Prepared for PostgreSQL integration via Drizzle ORM
- Schema defined for user management (username/password auth)

**Rationale**: The in-memory storage allows rapid prototyping while maintaining the interface contract for future database migration. Drizzle ORM provides type-safe database operations with PostgreSQL support when scaled.

### Data Storage Solutions

**Database (Prepared):**
- PostgreSQL via Neon serverless
- Drizzle ORM for type-safe queries and migrations
- Schema includes user table with UUID primary keys

**Current Implementation:**
- Development uses in-memory Map-based storage
- Production-ready database configuration present but not yet connected
- Migration system configured via drizzle-kit

**Design Decision**: Separation of storage interface from implementation allows seamless transition from development (in-memory) to production (PostgreSQL) without code changes in business logic.

### External Dependencies

**UI Component Library:**
- Radix UI primitives (@radix-ui/*) - Accessible, unstyled UI components
- Shadcn/ui configuration for component customization
- Icons: Lucide React, React Icons (Netflix, social media logos)

**Form Management:**
- React Hook Form - Performant form state management
- @hookform/resolvers - Zod schema integration
- Drizzle-zod - Database schema to Zod validation

**Database & ORM:**
- @neondatabase/serverless - Serverless PostgreSQL client
- Drizzle ORM - Type-safe database toolkit
- connect-pg-simple - PostgreSQL session store (prepared for authentication)

**Development Tools:**
- Vite plugins for Replit integration
- Runtime error overlay for development
- TSX for TypeScript execution in development

**Build & Deployment:**
- esbuild for server-side bundling
- Vite for client-side bundling
- Environment-based configuration (NODE_ENV)

**Notable Architectural Choices:**

1. **No Authentication Yet**: User schema exists but auth routes not implemented - prepared for future authentication layer
2. **Static Landing Page Focus**: Current implementation prioritizes conversion optimization over dynamic data fetching
3. **Type Safety**: Full TypeScript coverage with strict mode enabled
4. **Monorepo Structure**: Shared types/schemas between client and server via `shared/` directory
5. **Asset Management**: Static assets in `attached_assets/`, images referenced via Vite aliases
6. **Mobile-First**: Responsive design with custom hook (`use-mobile`) for breakpoint detection