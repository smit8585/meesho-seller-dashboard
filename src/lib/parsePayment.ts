import * as XLSX from "xlsx";

export interface PaymentRow {
  subOrderNo: string;
  liveOrderStatus: string;
  settlementAmount: number;
  paymentDate: string;
}

export function parsePaymentFile(buffer: Buffer): PaymentRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames.find((n) => n === "Order Payments") ?? workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const headerRowIndex = rows.findIndex((row) =>
    row.some((cell) => String(cell).trim() === "Sub Order No")
  );
  if (headerRowIndex === -1) return [];

  const headers = rows[headerRowIndex].map((h) => String(h).trim());
  const col = (name: string) => headers.indexOf(name);

  const subOrderCol = col("Sub Order No");
  const statusCol = col("Live Order Status");
  const amountCol = col("Final Settlement Amount");
  const paymentDateCol = col("Payment Date");

  const result: PaymentRow[] = [];
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const subOrderNo = String(row[subOrderCol] ?? "").trim();
    if (!subOrderNo) continue;

    result.push({
      subOrderNo,
      liveOrderStatus: String(row[statusCol] ?? "").trim(),
      settlementAmount: parseFloat(String(row[amountCol] ?? "0")) || 0,
      paymentDate: String(row[paymentDateCol] ?? "").trim(),
    });
  }

  return result;
}
