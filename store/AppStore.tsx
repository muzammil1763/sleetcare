"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  shortDesc: string;
  description: string;
  specs: { label: string; value: string }[];
  // Unstitched suit fields
  fabric?: string;
  pieces?: number;
  embroidery?: string;
  occasion?: string;
  season?: string;
  color?: string;
  videoUrl?: string;  // optional product video
  icon: string;
  image?: string;
  images?: string[];
  active?: boolean;
  order?: number;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  image?: string;
  active: boolean;
  order?: number;
  useCases: string[];
  benefits: string[];
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Operator" | "Viewer";
  status: "Active" | "Suspended";
  lastActive: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  active: boolean;
  order: number;
};

export type EngineeringService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  active: boolean;
  features: string[];
  order: number;
};

type CartItem = { productId: string; qty: number };

// ── API helpers ────────────────────────────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Context ────────────────────────────────────────────────────────────────
type AppState = {
  products: Product[];
  services: Service[];
  engineeringServices: EngineeringService[];
  orders: Order[];
  users: User[];
  socialLinks: SocialLink[];
  cart: CartItem[];
  loading: boolean;
  // Loaders
  loadProducts: () => Promise<void>;
  loadServices: () => Promise<void>;
  loadEngineeringServices: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadUsers: () => Promise<void>;
  loadSocialLinks: () => Promise<void>;
  // Products
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Services
  toggleService: (id: string) => Promise<void>;
  addService: (s: Omit<Service, "id">) => Promise<void>;
  updateService: (s: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  // Orders
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  placeOrder: (customer: { name: string; email: string }, items: CartItem[]) => Promise<Order>;
  // Users
  addUser: (u: { name: string; email: string; password: string; role: User["role"] }) => Promise<void>;
  updateUser: (id: string, data: Partial<User & { password: string }>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  // Social links
  addSocialLink: (l: Omit<SocialLink, "id">) => Promise<void>;
  updateSocialLink: (l: SocialLink) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;
  // Cart (client-side)
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
};

const AppContext = createContext<AppState | null>(null);

const CART_KEY = "majestic.cart.v1";

function loadCart(): CartItem[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CART_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [engineeringServices, setEngineeringServices] = useState<EngineeringService[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => { setCart(loadCart()); }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // ── Loaders ──
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try { 
      // Add timestamp to prevent caching
      setProducts(await apiFetch<Product[]>(`/api/products?t=${Date.now()}`)); 
    }
    catch { /* keep existing */ }
    finally { setLoading(false); }
  }, []);

  const loadServices = useCallback(async () => {
    try { 
      // Add timestamp to prevent caching
      setServices(await apiFetch<Service[]>(`/api/services?t=${Date.now()}`)); 
    } catch {}
  }, []);

  const loadEngineeringServices = useCallback(async () => {
    try { 
      // Add timestamp to prevent caching
      setEngineeringServices(await apiFetch<EngineeringService[]>(`/api/engineering-services?t=${Date.now()}`)); 
    } catch {}
  }, []);

  const loadOrders = useCallback(async () => {
    try { setOrders(await apiFetch<Order[]>("/api/orders")); } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    try { setUsers(await apiFetch<User[]>("/api/users")); } catch {}
  }, []);

  const loadSocialLinks = useCallback(async () => {
    try { setSocialLinks(await apiFetch<SocialLink[]>("/api/social-links")); } catch {}
  }, []);

  // Load all on mount
  useEffect(() => {
    loadProducts();
    loadServices();
    loadEngineeringServices();
  }, [loadProducts, loadServices, loadEngineeringServices]);

  // ── Products ──
  const addProduct = useCallback(async (p: Omit<Product, "id">) => {
    const created = await apiFetch<Product>("/api/products", { method: "POST", body: JSON.stringify(p) });
    setProducts((s) => [created, ...s]);
  }, []);

  const updateProduct = useCallback(async (p: Product) => {
    const updated = await apiFetch<Product>(`/api/products/${p.id}`, { method: "PUT", body: JSON.stringify(p) });
    setProducts((s) => s.map((x) => (x.id === p.id ? updated : x)));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((s) => s.filter((x) => x.id !== id));
  }, []);

  // ── Services ──
  const toggleService = useCallback(async (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    const updated = await apiFetch<Service>(`/api/services/${id}`, { method: "PUT", body: JSON.stringify({ active: !svc.active }) });
    setServices((s) => s.map((x) => (x.id === id ? updated : x)));
  }, [services]);

  const addService = useCallback(async (s: Omit<Service, "id">) => {
    const created = await apiFetch<Service>("/api/services", { method: "POST", body: JSON.stringify(s) });
    setServices((prev) => [...prev, created]);
  }, []);

  const updateService = useCallback(async (s: Service) => {
    const updated = await apiFetch<Service>(`/api/services/${s.id}`, { method: "PUT", body: JSON.stringify(s) });
    setServices((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
  }, []);

  const deleteService = useCallback(async (id: string) => {
    await apiFetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((s) => s.filter((x) => x.id !== id));
  }, []);

  // ── Orders ──
  const updateOrderStatus = useCallback(async (id: string, status: Order["status"]) => {
    const updated = await apiFetch<Order>(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    setOrders((s) => s.map((x) => (x.id === id ? { ...x, status: updated.status } : x)));
  }, []);

  const placeOrder = useCallback(async (customer: { name: string; email: string }, items: CartItem[]) => {
    const order = await apiFetch<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ customer: customer.name, email: customer.email, items }),
    });
    setOrders((s) => [order, ...s]);
    return order;
  }, []);

  // ── Users ──
  const addUser = useCallback(async (u: { name: string; email: string; password: string; role: User["role"] }) => {
    const created = await apiFetch<User>("/api/users", { method: "POST", body: JSON.stringify(u) });
    setUsers((s) => [created, ...s]);
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<User & { password: string }>) => {
    const updated = await apiFetch<User>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
    setUsers((s) => s.map((x) => (x.id === id ? { ...x, ...updated } : x)));
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    await apiFetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers((s) => s.filter((x) => x.id !== id));
  }, []);

  // ── Social Links ──
  const addSocialLink = useCallback(async (l: Omit<SocialLink, "id">) => {
    const created = await apiFetch<SocialLink>("/api/social-links", { method: "POST", body: JSON.stringify(l) });
    setSocialLinks((s) => [...s, created]);
  }, []);

  const updateSocialLink = useCallback(async (l: SocialLink) => {
    const updated = await apiFetch<SocialLink>(`/api/social-links/${l.id}`, { method: "PUT", body: JSON.stringify(l) });
    setSocialLinks((s) => s.map((x) => (x.id === l.id ? updated : x)));
  }, []);

  const deleteSocialLink = useCallback(async (id: string) => {
    await apiFetch(`/api/social-links/${id}`, { method: "DELETE" });
    setSocialLinks((s) => s.filter((x) => x.id !== id));
  }, []);

  // ── Cart (client-side only) ──
  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.productId === productId);
      if (existing) return c.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      return [...c, { productId, qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((c) => c.filter((i) => i.productId !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    setCart((c) => c.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<AppState>(() => ({
    products, services, engineeringServices, orders, users, socialLinks, cart, loading,
    loadProducts, loadServices, loadEngineeringServices, loadOrders, loadUsers, loadSocialLinks,
    addProduct, updateProduct, deleteProduct,
    toggleService, addService, updateService, deleteService,
    updateOrderStatus, placeOrder,
    addUser, updateUser, deleteUser,
    addSocialLink, updateSocialLink, deleteSocialLink,
    addToCart, removeFromCart, updateCartQty, clearCart,
  }), [
    products, services, engineeringServices, orders, users, socialLinks, cart, loading,
    loadProducts, loadServices, loadEngineeringServices, loadOrders, loadUsers, loadSocialLinks,
    addProduct, updateProduct, deleteProduct,
    toggleService, addService, updateService, deleteService,
    updateOrderStatus, placeOrder,
    addUser, updateUser, deleteUser,
    addSocialLink, updateSocialLink, deleteSocialLink,
    addToCart, removeFromCart, updateCartQty, clearCart,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
