# IOTCORE Industrial Systems - Next.js App Router

This is a Next.js conversion of the original React/Vite IOTCORE Industrial IoT e-commerce platform.

## Features

- **Next.js 14 App Router** with TypeScript
- **Tailwind CSS** with custom industrial design system
- **Shadcn/ui** component library
- **Client-side state management** with React Context
- **Responsive design** with mobile-first approach
- **Admin dashboard** with analytics, product/service management
- **E-commerce features** with cart, checkout, and order management

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs-app/
├── app/                    # Next.js App Router pages
│   ├── (site)/            # Public site pages
│   │   ├── about/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── order/[id]/
│   │   ├── products/
│   │   ├── services/
│   │   └── layout.tsx
│   ├── admin/             # Admin dashboard pages
│   │   ├── analytics/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── services/
│   │   ├── users/
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── site/              # Site-specific components
│   └── ui/                # Shadcn/ui components
├── data/                  # Mock data
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
└── store/                 # State management

```

## Key Differences from React/Vite Version

- **Routing**: React Router → Next.js App Router
- **Navigation**: `<Link>` from `react-router-dom` → `<Link>` from `next/link`
- **Client Components**: Pages with interactivity use `"use client"` directive
- **Image Optimization**: `<img>` → `<Image>` from `next/image`
- **Build System**: Vite → Next.js

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Populate database with sample data
- `npm run db:reset` - Show reset warning (requires --force flag)
- `npm run db:reset -- --force` - **⚠️ DELETE ALL DATA** from database
- `npm run db:fresh` - **⚠️ RESET + SEED** - Complete fresh start

#### Database Reset Commands

**Safe Reset (with confirmation):**
```bash
npm run db:reset
# Shows warning, requires --force flag to proceed
```

**Force Reset (immediate deletion):**
```bash
npm run db:reset -- --force
# OR shorthand:
npm run db:reset -- -f
```

**Complete Fresh Start:**
```bash
npm run db:fresh
# Deletes all data + repopulates with fresh sample data
```

> ⚠️ **WARNING**: Reset commands will permanently delete ALL data in your database. Use with caution!

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Recharts
- Lucide Icons
