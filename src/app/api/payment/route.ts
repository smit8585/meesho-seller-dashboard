import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePaymentFile } from "@/lib/parsePayment";
import { mapLiveStatus } from "@/lib/statusMapping";
import { OrderStatus } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = parsePaymentFile(buffer);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Could not find 'Order Payments' data in this file" }, { status: 400 });
  }

  let updated = 0;
  let notFound = 0;

  for (const row of rows) {
    const existing = await prisma.order.findUnique({ where: { subOrderNo: row.subOrderNo } });
    if (!existing) {
      notFound++;
      continue;
    }

    const newStatus = mapLiveStatus(row.liveOrderStatus, row.settlementAmount);

    await prisma.order.update({
      where: { id: existing.id },
      data: {
        status: newStatus as OrderStatus,
        liveOrderStatus: row.liveOrderStatus,
        settlementAmount: row.settlementAmount,
        paymentDate: row.paymentDate,
        statusHistory:
          existing.status !== newStatus
            ? {
                create: {
                  status: newStatus as OrderStatus,
                  note: `Updated from payment statement (Live Status: ${row.liveOrderStatus}, Settlement: ${row.settlementAmount})`,
                },
              }
            : undefined,
      },
    });
    updated++;
  }

  return NextResponse.json({
    totalParsed: rows.length,
    updated,
    notFound,
  });
}
