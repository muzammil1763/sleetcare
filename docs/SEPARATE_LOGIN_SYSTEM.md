# 🔐 Separate Login System - Customer vs Admin

## Overview
The system now has **completely separate** login pages for customers and admins.

---

## 🎯 Two Separate Login Pages

### 1. **Customer Login** - `/login`
- **URL**: `https://yoursite.com/login`
- **Purpose**: For customers to login and access their profile/orders
- **Design**: Clean, modern, customer-friendly
- **Features**:
  - Email + Password
  - "Create account" link → `/register`
  - "Back to home" link
  - Redirects to `/profile` after login
- **Access**: Public, visible in navbar

### 2. **Admin Login** - `/admin/login`
- **URL**: `https://yoursite.com/admin/login`
- **Purpose**: For admin/staff to access admin dashboard
- **Design**: Professional, dark theme with stats
- **Features**:
  - Email + Password
  - Show/hide password toggle
  - Default credentials hint
  - Redirects to `/admin` after login
- **Access**: Direct URL only, NOT in navbar

---

## 🔄 User Flows

### Customer Flow
```
1. Visit site → See "Login" button in navbar
2. Click "Login" → /login (customer login page)
3. New user? Click "Create one" → /register
4. Login → Redirected to /profile
5. Can view orders, manage account
```

### Admin Flow
```
1. Go directly to /admin/login (bookmark this!)
2. Login with admin credentials
3. Redirected to /admin dashboard
4. Manage products, orders, users, etc.
```

---

## 📍 What's in the Navbar

### Main Site Navbar (Customer-facing)
**When NOT logged in:**
- Home, Services, Products, About, Contact
- Cart icon (with count)
- **"Login"** button → `/login`

**When logged in (Customer):**
- Home, Services, Products, About, Contact
- Cart icon (with count)
- **"Profile"** button → `/profile`

**NO "Admin" button** - Admin is completely separate!

---

## 🔒 Security & Access

### Customer Login (`/login`)
- Creates/uses accounts with `role: "Viewer"`
- Can access:
  - `/profile` - View orders
  - `/checkout` - Place orders
  - `/cart` - Shopping cart
  - All public pages

### Admin Login (`/admin/login`)
- Uses accounts with `role: "Admin"` or `"Operator"`
- Can access:
  - `/admin/*` - All admin pages
  - Protected by middleware
  - Requires authentication

### Middleware Protection
- `/admin/*` routes require authentication
- Redirects to `/admin/login` if not authenticated
- `/admin/login` itself is public (no redirect loop)

---

## 📁 File Structure

```
app/
├── login/
│   └── page.tsx              # Customer login
├── register/
│   └── page.tsx              # Customer registration
├── (site)/
│   ├── profile/
│   │   └── page.tsx          # Customer profile
│   └── checkout/
│       └── page.tsx          # Requires customer login
└── admin/
    ├── login/
    │   └── page.tsx          # Admin login (separate!)
    └── [other admin pages]
```

---

## 🎨 Design Differences

| Feature | Customer Login | Admin Login |
|---------|---------------|-------------|
| **URL** | `/login` | `/admin/login` |
| **Theme** | Light, modern | Dark, professional |
| **Background** | Gradient sky/purple | Dark slate with stats |
| **Logo** | Simple icon | Logo + stats cards |
| **Links** | "Create account" | "Back to site" |
| **Redirect** | `/profile` | `/admin` |
| **In Navbar** | ✅ Yes | ❌ No |

---

## 🚀 How to Access

### For Customers:
1. Click "Login" in navbar
2. Or go to `/login`
3. Register if new user
4. Login and shop!

### For Admins:
1. **Bookmark** `/admin/login`
2. Or type URL directly
3. Login with admin credentials
4. Manage the site

**Important**: Admin login is NOT linked from the main site. You must know the URL!

---

## 🔧 Configuration

### Default Admin Credentials
(Shown on admin login page)
- Email: `elena@omnilynk.io`
- Password: `admin123`

### Creating New Admins
1. Login to admin dashboard
2. Go to `/admin/users`
3. Create new user with role "Admin" or "Operator"

### Creating Customers
- Customers self-register at `/register`
- Automatically assigned role "Viewer"

---

## ✅ Benefits of Separation

1. **Security**: Admin login not exposed to public
2. **Clarity**: Customers don't see admin options
3. **Branding**: Different designs for different audiences
4. **SEO**: Admin pages not indexed
5. **UX**: Simpler navigation for customers

---

## 📝 Summary

| Aspect | Customer | Admin |
|--------|----------|-------|
| **Login URL** | `/login` | `/admin/login` |
| **Register URL** | `/register` | N/A (manual) |
| **After Login** | `/profile` | `/admin` |
| **Navbar Link** | ✅ Yes | ❌ No |
| **Role** | Viewer | Admin/Operator |
| **Purpose** | Shop & track orders | Manage site |

---

**Status**: ✅ Implemented
**Last Updated**: April 30, 2026
