# Replit.md

## Overview

This is a full-stack web application for managing a Telegram bot system that handles technician task assignments, invoicing, and client management. The application provides a comprehensive dashboard for administrators to manage technicians, create and assign tasks, generate invoices, and monitor bot activities. It's built as a modern web application with a React frontend and Express.js backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **API Style**: RESTful API design
- **Session Management**: Simple bearer token authentication (development setup)
- **Error Handling**: Centralized error handling middleware
- **Development**: tsx for TypeScript execution in development

### Data Storage Solutions
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless driver for PostgreSQL connectivity

## Key Components

### Database Schema
The application uses five main entities:
- **Users**: System administrators with username/password authentication
- **Technicians**: Telegram bot users who receive and complete tasks
- **Tasks**: Work assignments with client information, scheduling, and status tracking
- **Invoices**: Payment tracking linked to completed tasks and technicians
- **Bot Settings**: Configuration for Telegram bot behavior and notifications
- **Notifications**: System alerts and activity logging

### Authentication System
- Simple bearer token system for demo purposes
- Session-based authentication middleware
- Role-based access control (admin role)
- Local storage for client-side token persistence

### UI/UX Features
- **Multi-language Support**: English and Arabic with RTL layout support
- **Dark/Light Theme**: CSS variable-based theming system
- **Audio Notifications**: Web Audio API integration for real-time alerts
- **Responsive Design**: Mobile-first approach with responsive components
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

### Task Management Flow
1. Admin creates task with client details and scheduling information
2. Task is assigned to available technician via Telegram bot
3. Technician accepts/rejects task through bot interface
4. Status updates flow from bot to database to admin dashboard
5. Upon completion, invoice generation is triggered

### Real-time Updates
- Server-side events trigger database updates
- React Query automatically refetches data based on query invalidation
- Audio notifications alert users to important status changes
- Toast notifications provide immediate user feedback

### API Communication
- RESTful endpoints for CRUD operations
- JSON request/response format
- Error responses include status codes and descriptive messages
- Request logging middleware for debugging and monitoring

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Neon serverless driver
- **UI Components**: Extensive Radix UI primitive collection
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod for runtime type checking and validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code formatting and linting (implied)
- **Vite Plugins**: Runtime error overlay and development enhancements

### Telegram Integration
- Bot framework integration (implementation pending)
- Webhook handling for real-time updates
- Message templating and localization support

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Frontend served on port 5000, backend API on same port
- **Hot Reload**: Vite development server with HMR
- **Development Command**: `npm run dev` runs both frontend and backend

### Production Build
- **Build Process**: Vite builds frontend assets, ESBuild bundles backend
- **Asset Optimization**: Automatic code splitting and minification
- **Static Serving**: Express serves built frontend assets
- **Environment Variables**: DATABASE_URL required for database connection

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment Target**: Autoscale deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
- June 18, 2025. Fixed responsive sidebar navigation for all screen sizes
- June 18, 2025. Resolved authentication issues preventing data loading
- June 18, 2025. Added missing secondary pages: Language Settings, Activity History, Backup & Restore
- June 18, 2025. Implemented mobile-friendly overlay system for sidebar
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```