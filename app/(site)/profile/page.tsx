"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package, LogOut, ShoppingBag, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Order = {
  id: string; customer: string; email: string; date: string;
  status: "Pending"|"Processing"|"Shipped"|"Delivered"|"Cancelled";
  total: number; items: number; createdAt: string;
  orderItems?: { id: string; qty: number; price: number; product: { name: string; image?: string; }; }[];
};

const statusConfig = {
  Pending:    { icon: Clock,         color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200"   },
  Processing: { icon: Package,       color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200"    },
  Shipped:    { icon: Truck,         color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200"  },
  Delivered:  { icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  Cancelled:  { icon: XCircle,       color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200"     },
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/profile");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/orders/my-orders")
      .then(r => r.json())
      .then(d => setOrders(Array.isArray(d) ? d.filter((o: Order) => !o.date?.startsWith("INQUIRY:")) : []))
      .catch(() => toast({ title: "Error", description: "Failed to load orders", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [session]);

  const formatDate = (s: string) => {
    try { return new Date(s).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }); }
    catch { return s; }
  };

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]"><Loader2 className="w-8 h-8 animate-spin text-[#1e2a5e]" /></div>;
  }

  const initials = session.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "SC";
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const inTransit = orders.filter(o => o.status === "Shipped" || o.status === "Processing").length;

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-10 pb-16 max-w-5xl">

        {/* Profile Header */}
        <div className="bg-white border border-[#dde2f0] p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#1e2a5e] flex items-center justify-center text-white font-display text-2xl">
                {initials}
              </div>
              <div>
                <h1 className="font-display text-2xl text-[#1e2a5e]">{session.user?.name}</h1>
                <p className="text-sm font-light text-[#5a6380] mt-0.5">{session.user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-emerald-700">Active Account</span>
                </div>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              className="flex items-center gap-2 border border-[#dde2f0] text-[11px] font-medium uppercase tracking-[0.15em] text-[#5a6380] px-4 py-2.5 hover:border-red-300 hover:text-red-500 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Orders",  value: orders.length,  color: "text-[#1e2a5e]", icon: ShoppingBag },
            { label: "Delivered",     value: delivered,      color: "text-emerald-600", icon: CheckCircle2 },
            { label: "In Transit",    value: inTransit,      color: "text-[#2d3a8c]", icon: Truck },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-[#dde2f0] p-6">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${s.color} shrink-0`} />
                  <div>
                    <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8fa0d8]">{s.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orders */}
        <div className="bg-white border border-[#dde2f0] p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dde2f0]">
            <h2 className="font-display text-xl text-[#1e2a5e]">Order History</h2>
            <Link href="/shop">
              <button className="flex items-center gap-2 border border-[#dde2f0] text-[11px] font-medium uppercase tracking-[0.15em] text-[#5a6380] px-4 py-2 hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors">
                <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#1e2a5e] mx-auto" /></div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 border border-[#dde2f0] flex items-center justify-center mx-auto mb-5">
                <Package className="w-7 h-7 text-[#8fa0d8]" />
              </div>
              <h3 className="font-display text-xl text-[#1e2a5e] mb-2">No orders yet</h3>
              <p className="text-sm font-light text-[#5a6380] mb-6">Start shopping to see your orders here</p>
              <Link href="/shop">
                <button className="bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#2d3a8c] transition-colors">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <div key={order.id} className="border border-[#dde2f0] p-6 hover:border-[#2d3a8c]/40 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="text-sm font-medium text-[#1e2a5e]">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] border ${statusConfig[order.status].bg} ${statusConfig[order.status].border} ${statusConfig[order.status].color}`}>
                            <StatusIcon className="w-3 h-3" />{order.status}
                          </span>
                        </div>
                        <p className="text-xs font-light text-[#5a6380]">
                          Placed on {formatDate(order.date || order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl text-[#1e2a5e]">
                          Rs. {order.total.toLocaleString("en-PK")}
                        </p>
                        <p className="text-xs font-light text-[#8fa0d8]">
                          {order.items} {order.items === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="border-t border-[#dde2f0] pt-4 space-y-3">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#dde8f8] shrink-0 overflow-hidden">
                              {item.product.image
                                ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#8fa0d8]" /></div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1e2a5e] truncate">{item.product.name}</p>
                              <p className="text-xs font-light text-[#5a6380]">
                                Qty: {item.qty} × Rs. {item.price.toLocaleString("en-PK")}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-[#1e2a5e] shrink-0">
                              Rs. {(item.qty * item.price).toLocaleString("en-PK")}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-4 border-t border-[#dde2f0]">
                      <Link href={`/order/${order.id}`} className="flex-1">
                        <button className="w-full border border-[#dde2f0] text-[11px] font-medium uppercase tracking-[0.15em] text-[#5a6380] py-2.5 hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
