import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Prisma.OrderWhereInput = {};

  if (status && status !== "ALL") {
    where.status = status as OrderStatus;
  }

  if (search) {
    where.OR = [
      { subOrderNo: { contains: search } },
      { awb: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
