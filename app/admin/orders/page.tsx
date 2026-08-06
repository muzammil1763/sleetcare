"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, Eye, RefreshCw, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type OrderItem = {
  id: string;
  productId: string;
  qty: number;
  price: number;
  product?: { name: string };
};

type Order = {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
  createdAt?: string;
  orderItems?: OrderItem[];
  shippingAddress?: {
    phone?: string;
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
};

const statusColor: Record<OrderStatus, string> = {
  Pending:    "text-amber-600 border-amber-300 bg-amber-50",
  Processing: "text-purple-600 border-purple-300 bg-purple-50",
  Shipped:    "text-sky-600 border-sky-300 bg-sky-50",
  Delivered:  "text-emerald-600 border-emerald-300 bg-emerald-50",
  Cancelled:  "text-red-600 border-red-300 bg-red-50",
};

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [view, setView] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "Failed to load orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter(
    (o) => {
      // Filter out inquiry records (they have INQUIRY: prefix in date field)
      if (o.date && o.date.startsWith('INQUIRY:')) return false;
      
      // Apply search filter
      return o.customer.toLowerCase().includes(q.toLowerCase()) ||
             o.email.toLowerCase().includes(q.toLowerCase()) ||
             o.id.toLowerCase().includes(q.toLowerCase());
    }
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      // If it's in YYYY-MM-DD format, parse it as local date
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
      
      // Otherwise parse as ISO string
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return "Invalid Date";
    }
  };

  const calculateTotal = (order: Order) => {
    // If total is already set and valid, use it
    if (order.total && order.total > 0) return order.total;
    
    // Otherwise calculate from order items
    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
    
    return 0;
  };

  const onStatusChange = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      if (view?.id === id) setView((v) => v ? { ...v, status } : v);
      toast({ title: "Status updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Commerce</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} orders</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders..." className="pl-9 w-64" />
          </div>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Items</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No orders found.</td></tr>
              ) : (
                filtered.map((o) => {
                  const total = calculateTotal(o);
                  return (
                    <tr key={o.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                      <td className="px-5 py-3 font-mono text-muted-foreground text-xs">{formatDate(o.date || o.createdAt || "")}</td>
                      <td className="px-5 py-3">
                        <div className="font-medium">{o.customer}</div>
                        <div className="text-[11px] text-muted-foreground">{o.email}</div>
                      </td>
                      <td className="px-5 py-3">
                        <Select value={o.status} onValueChange={(v) => onStatusChange(o.id, v as OrderStatus)} disabled={updating === o.id}>
                          <SelectTrigger className={`h-7 text-xs w-32 border rounded-md px-2 ${statusColor[o.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-3 text-right font-mono">{o.items}</td>
                      <td className="px-5 py-3 text-right font-mono font-semibold">Rs. {total.toLocaleString("en-PK")}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => setView(o)} className="p-2 rounded-md hover:bg-muted transition"><Eye className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader><DialogTitle className="font-mono">Order #{view?.id.slice(-8).toUpperCase()}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Customer</span>
                  <div className="font-medium">{view.customer}</div>
                </div>
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Email</span>
                  <div className="font-mono text-xs">{view.email}</div>
                </div>
                {view.phone && (
                  <div className="border-b border-border pb-2">
                    <span className="text-muted-foreground text-xs">Phone</span>
                    <div className="font-mono text-xs">{view.phone}</div>
                  </div>
                )}
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Date</span>
                  <div className="font-mono">{formatDate(view.date || view.createdAt || "")}</div>
                </div>
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Items</span>
                  <div className="font-mono">{view.items}</div>
                </div>
              </div>

              {/* Shipping Address */}
              {view.shippingAddress && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Shipping Address</h3>
                  <div className="bg-muted/30 rounded-md p-3 text-sm">
                    {view.shippingAddress.phone && <div className="font-mono text-xs mb-1">📞 {view.shippingAddress.phone}</div>}
                    {view.shippingAddress.address && <div>{view.shippingAddress.address}</div>}
                    <div>
                      {view.shippingAddress.city && <span>{view.shippingAddress.city}</span>}
                      {view.shippingAddress.zip && <span>, {view.shippingAddress.zip}</span>}
                    </div>
                    {view.shippingAddress.country && <div>{view.shippingAddress.country}</div>}
                  </div>
                </div>
              )}

              {view.orderItems && view.orderItems.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {view.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                        <div>
                          <div className="font-medium text-sm">{item.product?.name || "Product"}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">Rs. {(item.price * item.qty).toLocaleString("en-PK")}</div>
                          <div className="text-xs text-muted-foreground">Rs. {item.price.toLocaleString("en-PK")} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <div>
                  <span className="text-muted-foreground text-xs">Status</span>
                  <Select value={view.status} onValueChange={(v) => onStatusChange(view.id, v as OrderStatus)}>
                    <SelectTrigger className={`h-7 text-xs w-36 border rounded-md px-2 mt-1 ${statusColor[view.status]}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{ALL_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-xs">Total Amount</span>
                  <div className="font-mono text-2xl font-semibold text-primary">Rs. {calculateTotal(view).toLocaleString("en-PK")}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
