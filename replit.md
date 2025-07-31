# Overview

This is a production-ready web application for cryptocurrency flash transactions built with React on the frontend and Express.js on the backend. The application is branded as "Bolt Crypto Flasher" and provides a professional flash transaction gateway for cryptocurrency operations, allowing users to send various cryptocurrencies across different networks with advanced flash fee management and real-time balance tracking.

## User Preferences

Preferred communication style: Simple, everyday language.
Distribution requirement: Always apply changes to all three distribution versions (web app, .exe file, and native desktop app).

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
- **Database Provider**: PostgreSQL with Neon Database (@neondatabase/serverless)
- **Session Management**: Database-backed session storage with PostgreSQL
- **API Pattern**: RESTful endpoints under `/api` prefix

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type safety across frontend/backend
- **Migration Strategy**: Database push via `drizzle-kit push`

## Key Components

### Authentication System
- Enhanced registration system with email and personal information support
- Username/password authentication with optional email, firstName, lastName fields
- Default users: `admin/usdt123` and `SoftwareHenry/Rmabuw190` (automatic full access, no subscription required)
- New users can register with email and personal details, must purchase subscriptions to access platform
- Token-based session management stored in localStorage
- Protected routes with authentication and subscription validation (bypassed for admin users)
- Comprehensive admin user management system for account oversight

### Database Entities
1. **Users**: Enhanced user accounts with username/password, email, firstName, lastName, role, isActive status
2. **Wallets**: Multi-network cryptocurrency wallets per user
3. **Transactions**: Crypto flash transactions with flash fee tracking (all networks require flash fees)
4. **Subscription Plans**: Three tiers - Basic ($550), Pro ($950), Full ($3000)
5. **User Subscriptions**: Tracks user plan purchases and status

### Transaction Flow (Flash Transactions)
1. User selects cryptocurrency type (BTC, ETH, USDT, BNB)
2. Enters recipient address and amount
3. Selects network and flash speed options
4. System requires flash fee payment for ALL transactions using Tron wallet TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y
5. QR code and wallet address displayed for flash fee payment
6. Transaction status tracking (pending, completed, failed)

### Subscription System
1. New users register accounts through login page
2. After registration, users are redirected to pricing page
3. Three subscription tiers available with crypto payment to USDT address
4. Users must provide transaction hash as payment proof
5. Only users with active subscriptions can access the platform

### UI Components
- **Sidebar Navigation**: Fixed sidebar with Bolt Crypto Flasher branding and routing (includes admin panel for admin users)
- **Dashboard**: Portfolio overview and flash transaction statistics
- **Send Page**: Multi-tab flash transaction forms for different cryptocurrencies
- **Transaction History**: Filterable flash transaction list
- **Settings**: User preferences and configuration
- **Admin Panel**: Comprehensive user management interface for admin users only
- **Bolt Logo**: Custom 4D bolt design logo with gradient effects and 3D shadow

## Data Flow

### Client-Server Communication
- Frontend makes HTTP requests to backend API endpoints
- TanStack React Query handles caching and synchronization
- Form data validated on both client (Zod) and server sides
- Real-time updates through query invalidation

### Authentication Flow
1. User submits credentials to `/api/auth/login` OR registers new account via `/api/auth/register` with email support
2. Registration now captures username, email, firstName, lastName, password
3. Server validates against database user store
4. For new users: redirected to pricing page for subscription purchase
5. For existing users: subscription status validated before granting access
6. Returns user object and token on success with active subscription
7. Client stores token and user data in localStorage
8. Subsequent requests include authentication context
9. Admin users access dedicated admin panel for user management

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

### Multi-Format Distribution Strategy
The application supports three distribution formats that must be kept in sync:

1. **Web Application**: Live web version accessible via browser
2. **Standalone .exe**: 39MB executable file (BoltCryptoFlasher.exe) 
3. **Native Desktop App**: 158MB packaged application (BoltCryptoFlasher-Native.tar.gz)
4. **Portable Package**: 144KB web server package (BoltCryptoFlasher-Portable.tar.gz)

**Important**: All code changes must be propagated to all distribution versions using:
```bash
node rebuild-all-versions.js
```
This automated script rebuilds all four distribution formats and keeps them synchronized.

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment designation (development/production)
- Database provisioning handled automatically by Drizzle configuration

### Storage Strategy
- **Database**: PostgreSQL database with Drizzle ORM for all environments
- **Data Persistence**: All user data, transactions, and subscriptions stored in database
- **Session Management**: Database-backed session storage with PostgreSQL
- **Default Data**: Automatic seeding of admin users and subscription plans on startup

The application follows a typical full-stack React pattern with shared TypeScript types between frontend and backend, ensuring type safety across the entire application stack.

## Recent Updates (July 31, 2025)

### Email Registration System
- Enhanced user registration with email, firstName, lastName collection
- Database schema updated with new user fields: email (unique), firstName, lastName, role, isActive, updatedAt
- Registration form now captures optional personal information
- Email uniqueness validation prevents duplicate registrations
- Backward compatibility maintained for existing username-only accounts

### Admin User Management System
- Comprehensive admin panel accessible only to admin and SoftwareHenry users
- Complete CRUD operations for user management:
  - View all users with detailed information table
  - Edit user details: username, email, firstName, lastName, role, active status
  - Delete users (with protection for admin accounts)
  - Reset user passwords
- Real-time validation prevents username/email conflicts
- Admin panel integrated into main navigation with shield icon
- All changes synchronized across web app, .exe, native desktop, and portable versions

### Database Enhancements
- User table enhanced with email (unique constraint), firstName, lastName, role, isActive, updatedAt columns
- API endpoints added: GET/PUT/DELETE /api/admin/users, POST /api/admin/users/:id/reset-password
- Robust error handling and validation for all admin operations
- Protected admin accounts cannot be deleted via admin interface

### External Hosting Deployment (July 31, 2025)
- Created comprehensive deployment guides for external hosting providers
- Railway deployment: Integrated database hosting, automatic GitHub deployments (~$10/month)
- Vercel deployment: Superior SEO performance with global CDN, free tier available
- DigitalOcean deployment: Production-ready infrastructure (~$20/month)
- **SEO Optimization**: Vercel identified as optimal hosting solution for SEO performance
  - 95-100 Lighthouse scores achievable
  - Global CDN with 40+ edge locations
  - Automatic image optimization and compression
  - Sub-1 second loading times worldwide
- Created automated deployment scripts: deploy-railway.sh, deploy-vercel.sh
- SEO-enhanced configuration files: vercel-seo.json with security headers and caching
- Complete deployment checklist and troubleshooting guides
- Application already optimized with comprehensive meta tags, Open Graph cards, structured data