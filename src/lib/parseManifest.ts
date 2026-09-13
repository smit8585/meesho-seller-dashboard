import { PDFParse } from "pdf-parse";
import path from "path";

PDFParse.setWorker(
  path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")
);

export interface ManifestOrder {
  subOrderNo: string;
  awb: string;
  sku: string;
  quantity: number;
  size: string;
  courier: string;
  dispatchDate: string;
}

export async function parseManifestPdf(buffer: Buffer): Promise<ManifestOrder[]> {
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();

  const orders: ManifestOrder[] = [];

  // Split into sections per courier table
  const sections = text.split(/Courier\s*:\s*/g).slice(1);

  for (const section of sections) {
    const courierMatch = section.match(/^(.+)/);
    const courier = courierMatch ? courierMatch[1].trim() : "Unknown";

    const dateMatch = section.match(/Date\s*:\s*(.+)/);
    const dispatchDate = dateMatch ? dateMatch[1].trim() : "";

    // Row pattern: "<s.no> <part1>\n<part2>_1 <AWB> <SKU> <Qty> <Size>"
    const rowRegex = /^\d+\s+(\d+)\n(\d+)_1\s+(\S+)\s+(\S+)\s+(\d+)\s+(.+)$/gm;
    let match: RegExpExecArray | null;
    while ((match = rowRegex.exec(section)) !== null) {
      const [, part1, part2, awb, sku, qty, size] = match;
      orders.push({
        subOrderNo: `${part1}${part2}_1`,
        awb,
        sku,
        quantity: parseInt(qty, 10),
        size: size.trim(),
        courier,
        dispatchDate,
      });
    }
  }

  return orders;
}
