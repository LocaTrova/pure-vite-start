# Project: Locatrova Landing Page

## Project Overview

This is a full-stack web application for **Locatrova**, a platform that connects property owners with creative productions and events, similar to an "Airbnb for film shoots and events." The application consists of a conversion-optimized landing page with a multi-step registration form to onboard property owners.

The project is built with a modern tech stack:

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.
*   **Backend:** Node.js, Express, and TypeScript.
*   **Database:** Drizzle ORM (currently using in-memory storage for development, with PostgreSQL as the target database).

The project is structured as a monorepo with `client`, `server`, and `shared` directories.

## Building and Running

### Development

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the Vite development server for the frontend and the Express server for the backend, with hot module replacement enabled.

### Production

To build the application for production, use the following command:

```bash
npm run build
```

This will create a `dist` directory with the optimized frontend and backend code.

To run the application in production, use the following command:

```bash
npm run start
```

## Development Conventions

*   **Code Style:** The project uses TypeScript and follows standard coding conventions.
*   **Styling:** Styling is done using Tailwind CSS.
*   **Components:** The frontend uses `shadcn/ui` components, which are built on top of Radix UI.
*   **State Management:** The project uses TanStack Query (React Query) for managing server state.
*   **Forms:** Forms are built using React Hook Form with Zod for validation.
*   **Database:** The project uses Drizzle ORM for database access. Migrations are managed with `drizzle-kit`.
*   **API:** The backend provides a RESTful API.
