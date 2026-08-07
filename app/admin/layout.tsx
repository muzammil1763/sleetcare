"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  ArrowLeft, Link2, LogOut, Settings, MessageSquare, Tag, Menu, X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const links = [
  { href: "/admin",              label: "Overview",     icon: LayoutDashboard, exact: true },
  { href: "/admin/products",     label: "Products",     icon: Package },
  { href: "/admin/categories",   label: "Categories",   icon: Tag },
  { href: "/admin/orders",       label: "Orders",       icon: ShoppingBag },
  { href: "/admin/inquiries",    label: "Inquiries",    icon: MessageSquare },
  { href: "/admin/users",        label: "Users",        icon: Users },
  { href: "/admin/social-links", label: "Social Links", icon: Link2 },
  { href: "/admin/analytics",    label: "Analytics",    icon: BarChart3 },
  { href: "/admin/settings",     label: "Settings",     icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin-login");
  };

  const initials = session?.user?.name
    ?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "AD";

  return (
    <div className="min-h-screen flex bg-[#f7f8fc]" style={{ fontFamily: "Jost, system-ui, sans-serif" }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#1e2a5e] h-screen fixed left-0 top-0 z-40">

        {/* Logo */}
        <div className="h-20 flex items-center px-5 border-b border-[#8fa0d8]/15 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Sleet Care" className="h-12 w-auto" />
            <div className="text-[8px] uppercase tracking-[0.3em] text-[#c8d0f0]/50">Admin</div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1 space-y-0.5 overflow-y-auto scrollbar-hide">
          <div className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#c8d0f0]/30 px-3 py-3">
            Management
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                isActive(l.href, l.exact)
                  ? "bg-[#c8d0f0]/15 text-white border-l-2 border-[#8fa0d8]"
                  : "text-[#c8d0f0]/60 hover:text-white hover:bg-[#c8d0f0]/8 border-l-2 border-transparent"
              }`}
            >
              <l.icon className="w-3.5 h-3.5 shrink-0" />
              {l.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-[#8fa0d8]/15 space-y-1 shrink-0">
          {session?.user && (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-[#c8d0f0]/8">
              <div className="w-7 h-7 bg-[#8fa0d8]/30 border border-[#8fa0d8]/40 flex items-center justify-center text-[10px] font-medium text-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-white truncate">{session.user.name}</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-[#c8d0f0]/50 truncate">
                  {(session.user as any).role ?? "Admin"}
                </div>
              </div>
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#c8d0f0]/40 hover:text-[#c8d0f0] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Exit to site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-red-400/60 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40">
        <header className="h-14 flex items-center justify-between px-4 bg-[#1e2a5e] border-b border-[#8fa0d8]/15">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Sleet Care" className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#c8d0f0] hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="bg-[#1e2a5e] border-b border-[#8fa0d8]/15 px-3 py-3 space-y-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                  isActive(l.href, l.exact)
                    ? "bg-[#c8d0f0]/15 text-white border-l-2 border-[#8fa0d8]"
                    : "text-[#c8d0f0]/60 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <l.icon className="w-3.5 h-3.5" />
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#8fa0d8]/15 space-y-1">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#c8d0f0]/40 hover:text-[#c8d0f0]">
                <ArrowLeft className="w-3 h-3" /> Exit to site
              </Link>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-red-400/60 hover:text-red-400">
                <LogOut className="w-3 h-3" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        {/* Top bar — desktop */}
        <div className="hidden lg:flex h-14 items-center justify-between px-8 bg-white border-b border-[#dde2f0] sticky top-0 z-30">
          <div>
            {/* Breadcrumb */}
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c]">
              {links.find((l) => isActive(l.href, l.exact))?.label ?? "Admin"}
            </p>
          </div>
          {session?.user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-medium text-[#1e2a5e]">{session.user.name}</p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#8fa0d8]">
                  {(session.user as any).role ?? "Admin"}
                </p>
              </div>
              <div className="w-8 h-8 bg-[#1e2a5e] flex items-center justify-center text-[10px] font-medium text-white">
                {initials}
              </div>
            </div>
          )}
        </div>

        <main className="flex-1 p-5 lg:p-8 mt-14 lg:mt-0 scrollbar-hide">{children}</main>
      </div>
    </div>
  );
}
