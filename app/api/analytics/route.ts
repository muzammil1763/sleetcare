import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalOrders, totalProducts, totalUsers, services, engineeringServices, orders] = await Promise.all([
      // Exclude inquiry records (stored as orders with INQUIRY: prefix in date field)
      prisma.order.count({ where: { date: { not: { startsWith: "INQUIRY:" } } } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.service.findMany({ select: { id: true, active: true } }),
      prisma.engineeringService.findMany({ select: { id: true, active: true } }),
      prisma.order.findMany({
        where: { date: { not: { startsWith: "INQUIRY:" } } },
        select: { total: true, status: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Revenue only from delivered orders
    const revenue = orders
      .filter((o) => o.status === "Delivered")
      .reduce((s, o) => s + o.total, 0);

    // Build 6-month sales trend
    const now = new Date();
    const salesTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const month = d.toLocaleString("default", { month: "short" });
      const monthOrders = orders.filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });
      const rev = monthOrders.filter((o) => o.status === "Delivered").reduce((s, o) => s + o.total, 0);
      return { month, revenue: Math.round(rev) };
    });

    // Build 6-week orders over time with date ranges
    const ordersOverTime = Array.from({ length: 6 }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (5 - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // 6 days later for a full week
      
      const count = orders.filter((o) => {
        const od = new Date(o.createdAt);
        return od >= weekStart && od < weekEnd;
      }).length;
      
      // Format as "Dec 15-21" or "Jan 1-7"
      const startMonth = weekStart.toLocaleString("default", { month: "short" });
      const startDay = weekStart.getDate();
      const endDay = weekEnd.getDate();
      const label = `${startMonth} ${startDay}-${endDay}`;
      
      return { week: label, orders: count };
    });

    // Category breakdown
    const categoryData = await prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      activeServices: services.filter((s) => s.active).length,
      totalServices: services.length,
      activeEngineeringServices: engineeringServices.filter((s) => s.active).length,
      totalEngineeringServices: engineeringServices.length,
      revenue: Math.round(revenue),
      salesTrend,
      ordersOverTime,
      categoryData: categoryData.map((c) => ({ name: c.category, value: c._count.id })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
