"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const CHART_COLORS = ["#1e2a5e", "#2d3a8c", "#8fa0d8", "#c8d0f0", "#dde2f0"];

const tooltipStyle = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #dde2f0",
    borderRadius: 0,
    fontSize: 11,
    fontFamily: "Jost, system-ui, sans-serif",
  },
  labelStyle: { color: "#1e2a5e", fontWeight: 500 },
};

type Analytics = {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenue: number;
  salesTrend: { month: string; revenue: number }[];
  ordersOverTime: { week: string; orders: number }[];
  categoryData: { name: string; value: number }[];
};

type RecentOrder = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
};

const STATUS_STYLES: Record<string, string> = {
  Pending:    "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  Delivered:  "bg-green-50 text-green-700 border-green-200",
  Cancelled:  "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () =>
    Promise.all([
      fetch("/api/analytics", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/orders", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([a, o]) => {
        setAnalytics(a);
        setRecentOrders(Array.isArray(o) ? o.slice(0, 6) : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#8fa0d8]" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20 text-[#5a6380] text-sm">Failed to load dashboard data.</div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `Rs. ${(analytics.revenue / 1000).toFixed(1)}k`,
      icon: DollarSign,
      sub: "from delivered orders",
      accent: "#2d3a8c",
      bg: "#f0f4ff",
    },
    {
      label: "Total Orders",
      value: analytics.totalOrders,
      icon: ShoppingBag,
      sub: `${analytics.totalOrders} orders placed`,
      accent: "#1e2a5e",
      bg: "#eef0f8",
    },
    {
      label: "Total Products",
      value: analytics.totalProducts,
      icon: Package,
      sub: "items in catalog",
      accent: "#5a6380",
      bg: "#f7f8fc",
    },
    {
      label: "Total Customers",
      value: analytics.totalUsers,
      icon: Users,
      sub: "registered accounts",
      accent: "#8fa0d8",
      bg: "#f7f8fc",
    },
  ];

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-body), Jost, system-ui, sans-serif" }}>

      {/* Header */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-2">Dashboard</p>
        <h1
          className="text-[#1e2a5e] leading-tight"
          style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "32px", fontWeight: 400 }}
        >
          Overview
        </h1>
        <p className="text-sm font-light text-[#5a6380] mt-1">
          Real-time snapshot of your store performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#dde2f0] p-6"
            style={{ backgroundColor: s.bg }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-9 h-9 flex items-center justify-center border"
                style={{ borderColor: s.accent + "40", backgroundColor: s.accent + "10" }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.accent }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-[#8fa0d8]" />
            </div>
            <div
              className="text-3xl text-[#1e2a5e] mb-1"
              style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400 }}
            >
              {s.value}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380]">{s.label}</div>
            <div className="text-[10px] font-light text-[#8fa0d8] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-white border border-[#dde2f0] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">Revenue</p>
              <h3 className="text-[#1e2a5e] font-light" style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "20px" }}>
                Sales Trend
              </h3>
            </div>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8] border border-[#dde2f0] px-3 py-1.5">
              6 months
            </span>
          </div>
          {analytics.salesTrend.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm font-light text-[#8fa0d8]">
              No revenue data yet — place some orders to see trends.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde2f0" />
                <XAxis dataKey="month" stroke="#8fa0d8" fontSize={10} tickLine={false} />
                <YAxis stroke="#8fa0d8" fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `Rs. ${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`Rs. ${v.toLocaleString("en-PK")}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#1e2a5e" strokeWidth={1.5}
                  dot={{ fill: "#1e2a5e", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#2d3a8c" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Product Mix */}
        <div className="bg-white border border-[#dde2f0] p-6">
          <div className="mb-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">Collections</p>
            <h3 className="text-[#1e2a5e] font-light" style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "20px" }}>
              Product Mix
            </h3>
          </div>
          {analytics.categoryData.every((c) => c.value === 0) ? (
            <div className="h-[220px] flex items-center justify-center text-sm font-light text-[#8fa0d8]">
              No products yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={analytics.categoryData} dataKey="value"
                  innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                  {analytics.categoryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 10, fontFamily: "Jost, system-ui", letterSpacing: "0.05em" }}
                  iconType="square" iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Orders over time */}
        <div className="bg-white border border-[#dde2f0] p-6">
          <div className="mb-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">Orders</p>
            <h3 className="text-[#1e2a5e] font-light" style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "20px" }}>
              Weekly Volume
            </h3>
          </div>
          {analytics.ordersOverTime.every((w) => w.orders === 0) ? (
            <div className="h-[200px] flex items-center justify-center text-sm font-light text-[#8fa0d8]">
              No orders yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.ordersOverTime} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde2f0" vertical={false} />
                <XAxis dataKey="week" stroke="#8fa0d8" fontSize={10} tickLine={false} />
                <YAxis stroke="#8fa0d8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="orders" fill="#1e2a5e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-[#dde2f0] p-6">
          <div className="mb-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">Latest</p>
            <h3 className="text-[#1e2a5e] font-light" style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "20px" }}>
              Recent Orders
            </h3>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-10 text-center text-sm font-light text-[#8fa0d8]">No orders yet.</div>
          ) : (
            <div className="space-y-0">
              {recentOrders.map((o, i) => (
                <div
                  key={o.id}
                  className={`flex items-center justify-between py-3 ${i < recentOrders.length - 1 ? "border-b border-[#dde2f0]" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8fa0d8] mb-0.5">
                      #{o.id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-sm font-light text-[#1e2a5e] truncate">{o.customer}</div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-sm font-medium text-[#1e2a5e] mb-1">
                      Rs. {o.total.toLocaleString("en-PK")}
                    </div>
                    <span
                      className={`text-[9px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 border ${
                        STATUS_STYLES[o.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
