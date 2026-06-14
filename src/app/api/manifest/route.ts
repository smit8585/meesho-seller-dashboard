import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseManifestPdf } from "@/lib/parseManifest";
import { OrderStatus } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsedOrders = await parseManifestPdf(buffer);

  if (parsedOrders.length === 0) {
    return NextResponse.json({ error: "Could not find any orders in this manifest" }, { status: 400 });
  }

  const manifest = await prisma.manifest.create({
    data: {
      fileName: file.name,
      date: parsedOrders[0]?.dispatchDate ?? null,
    },
  });

  let created = 0;
  let skipped = 0;

  for (const o of parsedOrders) {
    try {
      await prisma.order.create({
        data: {
          subOrderNo: o.subOrderNo,
          awb: o.awb,
          sku: o.sku,
          courier: o.courier,
          size: o.size,
          quantity: o.quantity,
          dispatchDate: o.dispatchDate,
          status: OrderStatus.DISPATCHED,
          manifestId: manifest.id,
          statusHistory: {
            create: { status: OrderStatus.DISPATCHED, note: "Order added from manifest upload" },
          },
        },
      });
      created++;
    } catch {
      // likely duplicate subOrderNo (already tracked)
      skipped++;
    }
  }

  return NextResponse.json({
    manifestId: manifest.id,
    totalParsed: parsedOrders.length,
    created,
    skipped,
  });
}
