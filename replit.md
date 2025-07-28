# Overview

This is a full-stack cryptocurrency transaction management application built with React on the frontend and Express.js on the backend. The application simulates a "Flash Gateway" for cryptocurrency transactions, allowing users to send various cryptocurrencies across different networks with gas fee management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state, React Context for authentication
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with development hot-reload

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Simplified token-based authentication
- **API Pattern**: RESTful endpoints under `/api` prefix

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type safety across frontend/backend
- **Migration Strategy**: Database push via `drizzle-kit push`

## Key Components

### Authentication System
- Simple username/password authentication with hardcoded users
- Default users: `admin/usdt123` and `SoftwareHenry/Rmabuw190`
- Token-based session management stored in localStorage
- Protected routes with authentication context

### Database Entities
1. **Users**: Basic user accounts with username/password
2. **Wallets**: Multi-network cryptocurrency wallets per user
3. **Transactions**: Crypto transactions with gas fee tracking

### Transaction Flow
1. User selects cryptocurrency type (BTC, ETH, USDT, BNB)
2. Enters recipient address and amount
3. Selects network and gas speed options
4. System requires gas fee payment for certain transactions
5. QR code and wallet address displayed for gas fee payment
6. Transaction status tracking (pending, completed, failed)

### UI Components
- **Sidebar Navigation**: Fixed sidebar with routing
- **Dashboard**: Portfolio overview and statistics
- **Send Page**: Multi-tab transaction forms for different cryptocurrencies
- **Transaction History**: Filterable transaction list
- **Settings**: User preferences and configuration

## Data Flow

### Client-Server Communication
- Frontend makes HTTP requests to backend API endpoints
- TanStack React Query handles caching and synchronization
- Form data validated on both client (Zod) and server sides
- Real-time updates through query invalidation

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Server validates against in-memory user store
3. Returns user object and token on success
4. Client stores token and user data in localStorage
5. Subsequent requests include authentication context

### Transaction Processing
1. Form validation on client side
2. Transaction creation via `/api/transactions`
3. Gas fee payment simulation for USDT transactions
4. Status updates and confirmation modals
5. Transaction history updates

## External Dependencies

### UI and Styling
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### State and Data Management
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **@hookform/resolvers**: Form validation integration
- **zod**: Schema validation

### Database and Backend
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL ORM
- **drizzle-zod**: Schema to Zod validation bridge

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development
- Frontend: Vite development server with HMR
- Backend: Node.js with tsx for TypeScript execution
- Database: Neon Database with environment variable configuration
- Script: `npm run dev` starts the full stack

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server to `dist/index.js`
- Database: Production PostgreSQL via DATABASE_URL environment variable
- Script: `npm run build` then `npm start`

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment designation (development/production)
- Database provisioning handled automatically by Drizzle configuration

### Storage Strategy
- **Development**: In-memory storage with default data seeding
- **Production**: PostgreSQL database with Drizzle ORM migrations
- **Session Management**: Simplified token-based (not production-ready)

The application follows a typical full-stack React pattern with shared TypeScript types between frontend and backend, ensuring type safety across the entire application stack.