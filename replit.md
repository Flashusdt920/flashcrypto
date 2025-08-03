# Overview

Bolt Crypto Flasher is a production-ready web application providing a professional flash transaction gateway for cryptocurrencies. It enables users to perform flash transactions across various networks with advanced flash fee management and real-time balance tracking. The project aims to offer a secure and efficient platform for cryptocurrency operations.

# User Preferences

Preferred communication style: Simple, everyday language.
Distribution requirement: Always apply changes to all three distribution versions (web app, .exe file, and native desktop app).

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state, React Context for authentication
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database
- **Session Management**: Database-backed session storage with PostgreSQL
- **API Pattern**: RESTful endpoints under `/api` prefix

## Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type safety
- **Migration Strategy**: Database push via `drizzle-kit push`

## Key Features
- **Authentication System**: Email registration, user profile management, token-based authentication, protected routes, and a comprehensive admin panel for user management. Admin credentials: `admin/usdt123` and `SoftwareHenry/Rmabuw190`.
- **Flash Transaction Flow**: Supports BTC, ETH, USDT, BNB transactions. Requires flash fee payment to Tron wallet TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y.
- **Subscription System**: Three tiers (Basic, Pro, Full) requiring crypto payment to a USDT address with transaction hash proof. Only users with active subscriptions can access the platform.
- **UI Components**: Sidebar navigation, dashboard, send page, transaction history, settings, and an admin panel. Features a custom 4D bolt design logo.
- **Data Flow**: Client-server communication via HTTP requests, TanStack React Query for caching, and client/server-side validation.
- **Multi-Format Distribution**: Supports web application, standalone .exe, native desktop app, and a portable package. All code changes must be propagated to all distribution versions using an automated rebuild script.
- **Environment Configuration**: Uses `DATABASE_URL` and `NODE_ENV` environment variables.
- **Storage Strategy**: PostgreSQL for all data persistence and session management. Automatic seeding of admin users and subscription plans.
- **SEO Optimization**: Comprehensive meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), dynamic sitemap, Google Analytics integration, PWA manifest, robots.txt optimization, and canonical URL management.

# External Dependencies

## UI and Styling
- **@radix-ui/***: UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## State and Data Management
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **@hookform/resolvers**: Form validation integration
- **zod**: Schema validation

## Database and Backend
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL ORM
- **drizzle-zod**: Schema to Zod validation bridge

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution for development