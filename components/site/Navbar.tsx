"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, ChevronDown, Menu, X } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useSession } from "next-auth/react";

type Category = {
  id: string;
  name: string;
  description: string;
};

export default function Navbar() {
  const { cart } = useAppStore();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  const isAdmin = session?.user && (session.user as any).role !== "Viewer";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        setCategories(data.sort((a: Category, b: Category) => a.name.localeCompare(b.name)));
      } catch {}
    };
    loadCategories();
  }, []);

  const navLinks = [
    { label: "Home",        href: "/",          hasDropdown: false, items: [] },
    { label: "Shop",        href: "/shop",       hasDropdown: false, items: [] },
    { label: "Collections", href: "/categories", hasDropdown: true,  items: categories },
    { label: "About",       href: "/about",      hasDropdown: false, items: [] },
    { label: "Contact",     href: "/contact",    hasDropdown: false, items: [] },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#1e2a5e] text-[#c8d0f0] text-center py-2.5 text-[11px] font-normal tracking-[0.18em] uppercase overflow-hidden">
        <div className="animate-scroll whitespace-nowrap inline-block">
          <span className="inline-block px-8">Free Shipping on Orders Over Rs. 5,000</span>
          <span className="inline-block px-4 text-[#8fa0d8]">·</span>
          <span className="inline-block px-8">Get 10% Off Your First Order</span>
          <span className="inline-block px-4 text-[#8fa0d8]">·</span>
          <span className="inline-block px-8">100% Natural Ingredients</span>
          <span className="inline-block px-4 text-[#8fa0d8]">·</span>
          <span className="inline-block px-8">Free Shipping on Orders Over Rs. 5,000</span>
          <span className="inline-block px-4 text-[#8fa0d8]">·</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 border-b border-[#dde2f0] ${scrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Sleet Care"
                className="h-14 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors py-2 ${
                      pathname === link.href ? "text-[#1e2a5e]" : "text-[#5a6380] hover:text-[#1e2a5e]"
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </Link>
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1e2a5e]" />
                  )}
                  {link.hasDropdown && openDropdown === link.label && link.items.length > 0 && (
                    <div className="absolute top-full left-0 mt-0 bg-white border border-[#dde2f0] shadow-lg py-3 min-w-[200px] z-50">
                      {link.items.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products?category=${encodeURIComponent(item.name)}`}
                          className="block px-5 py-2.5 text-[11px] font-normal uppercase tracking-[0.15em] text-[#5a6380] hover:text-[#1e2a5e] hover:bg-[#eef0f8] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  const query = prompt("Search for products:");
                  if (query) window.location.href = `/products?search=${encodeURIComponent(query)}`;
                }}
                className="text-[#5a6380] hover:text-[#1e2a5e] transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {session ? (
                <Link href={isAdmin ? "/admin" : "/profile"} className="flex items-center justify-center hover:opacity-80 transition-opacity" title={session.user?.name || "Profile"}>
                  <div className="w-8 h-8 rounded-full bg-[#1e2a5e] flex items-center justify-center text-white text-[11px] font-medium uppercase tracking-wide">
                    {session.user?.name
                      ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                      : <User className="w-4 h-4" />}
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="text-[#5a6380] hover:text-[#1e2a5e] transition-colors" title="Sign in">
                  <User className="w-[18px] h-[18px]" />
                </Link>
              )}

              <Link href="/cart" className="relative text-[#5a6380] hover:text-[#1e2a5e] transition-colors">
                <ShoppingCart className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#1e2a5e] text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#5a6380] hover:text-[#1e2a5e] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#dde2f0] bg-white">
            <nav className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1e2a5e] border-b border-[#dde2f0]"
                  >
                    {link.label}
                  </Link>
                  {link.items.length > 0 && (
                    <div className="pl-4">
                      {link.items.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products?category=${encodeURIComponent(item.name)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2.5 px-2 text-[10px] font-normal uppercase tracking-[0.15em] text-[#5a6380] hover:text-[#1e2a5e] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
