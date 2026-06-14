import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany();

  const statusCounts: Record<string, number> = {};
  let totalSettlement = 0;
  let pendingPaymentCount = 0;

  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    if (o.settlementAmount != null) {
      totalSettlement += o.settlementAmount;
    }
    if (o.status === "DISPATCHED" || o.status === "IN_TRANSIT") {
      pendingPaymentCount++;
    }
  }

  return NextResponse.json({
    totalOrders: orders.length,
    statusCounts,
    totalSettlement,
    pendingPaymentCount,
  });
}
