"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/AppStore";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 },
};

type Analytics = {
  salesTrend: { month: string; revenue: number }[];
  categoryData: { name: string; value: number }[];
  ordersOverTime: { week: string; orders: number }[];
};

export default function AdminAnalytics() {
  const { products, services, loadProducts, loadServices } = useAppStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadServices();
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loadProducts, loadServices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Build product performance from real products (stock as proxy for demand)
  const productPerf = products.slice(0, 8).map((p) => ({
    name: p.name.split(" ")[0],
    stock: p.stock,
    price: p.price,
  }));

  // Build service data from real services
  const serviceData = services.map((s) => ({
    name: s.name.split(" ")[0],
    active: s.active ? 1 : 0,
    status: s.active ? "Active" : "Inactive",
  }));

  const salesTrend = analytics?.salesTrend ?? [];
  const ordersOverTime = analytics?.ordersOverTime ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="chip mb-2">// Insights</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Real data from your MongoDB database.</p>
      </div>

      {/* Revenue growth */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-1">Revenue growth</h3>
        <p className="text-xs text-muted-foreground mb-4">Calculated from non-cancelled orders in the last 6 months.</p>
        {salesTrend.length === 0 || salesTrend.every((m) => m.revenue === 0) ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            No revenue data yet — orders will appear here once placed.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `Rs. ${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`Rs. ${v.toLocaleString("en-PK")}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Orders over time */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-1">Orders over time</h3>
          <p className="text-xs text-muted-foreground mb-4">Weekly order count from the last 6 weeks.</p>
          {ordersOverTime.every((w) => w.orders === 0) ? (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">No orders yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="orders" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Product stock levels */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-1">Product stock levels</h3>
          <p className="text-xs text-muted-foreground mb-4">Current inventory from the database.</p>
          {productPerf.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">No products yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={productPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number, name: string) => [v, name === "stock" ? "Units in stock" : name]} />
                <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Services status */}
      <div className="glass-card p-5">
        <h3 className="font-semibold mb-1">Services status</h3>
        <p className="text-xs text-muted-foreground mb-4">Active vs inactive services from the database.</p>
        {serviceData.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">No services yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.map((s) => (
              <div key={s.id} className={`glass-card p-4 border ${s.active ? "border-primary/30" : "border-border/30 opacity-60"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${s.active ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                  <span className={`text-xs font-mono uppercase tracking-wider ${s.active ? "text-primary" : "text-muted-foreground"}`}>
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.tagline}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product price table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Product catalog summary</h3>
          <p className="text-xs text-muted-foreground mt-1">Live data from MongoDB — {products.length} products total.</p>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((p) => (
                <tr key={p.id} className="border-t border-border/40 hover:bg-muted/20 transition">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3"><span className="chip">{p.category}</span></td>
                  <td className="px-5 py-3 text-right font-mono">Rs. {p.price.toLocaleString("en-PK")}</td>
                  <td className="px-5 py-3 text-right font-mono">
                    <span className={p.stock < 40 ? "text-amber-600 font-semibold" : ""}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                    Rs. {(p.price * p.stock).toLocaleString("en-PK")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
