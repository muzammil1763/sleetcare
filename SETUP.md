# IOTCORE Next.js Setup Guide

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── (site)/            # Public pages
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── site/              # Site components (Navbar, Footer)
│   └── ui/                # Shadcn/ui components
├── data/                  # Mock data
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
├── store/                 # State management
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

✅ Next.js 14 App Router with TypeScript
✅ Tailwind CSS with custom industrial design system
✅ Shadcn/ui component library
✅ Client-side state management
✅ E-commerce features (cart, checkout, orders)
✅ Admin dashboard with analytics
✅ Responsive design
✅ Dark mode theme

## Pages

### Public Pages
- `/` - Home
- `/about` - About
- `/contact` - Contact
- `/services` - Services listing
- `/services/[slug]` - Service detail
- `/products` - Products catalog
- `/products/[id]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/order/[id]` - Order confirmation

### Admin Pages
- `/admin` - Dashboard overview
- `/admin/products` - Product management
- `/admin/services` - Service management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/analytics` - Analytics

## Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: React Context API

## Notes

- All pages with interactivity use `"use client"` directive
- State persists in localStorage
- Images optimized with Next.js Image component
- Responsive design with mobile-first approach
