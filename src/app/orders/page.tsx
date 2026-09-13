"use client";

import { useEffect, useState } from "react";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/statusMapping";

interface Order {
  id: string;
  subOrderNo: string;
  awb: string | null;
  sku: string | null;
  courier: string | null;
  size: string | null;
  quantity: number;
  dispatchDate: string | null;
  status: string;
  liveOrderStatus: string | null;
  settlementAmount: number | null;
  paymentDate: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    if (search) params.set("search", search);

    setLoading(true);
    fetch(`/api/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  }, [search, status]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">All orders from your dispatched manifests.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search Sub Order No, AWB, or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-400 self-center">
          {!loading && `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Sub Order No</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Courier</th>
              <th className="px-4 py-3">AWB</th>
              <th className="px-4 py-3">Dispatched</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Settlement</th>
              <th className="px-4 py-3">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  {search || status !== "ALL"
                    ? "No orders match your filters."
                    : "No orders yet. Upload a manifest to get started."}
                </td>
              </tr>
            )}
            {orders.map((o, i) => (
              <tr
                key={o.id}
                className={`border-t hover:bg-gray-50 transition-colors ${
                  i % 2 === 0 ? "" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-[140px] truncate" title={o.subOrderNo}>
                  {o.subOrderNo}
                </td>
                <td className="px-4 py-3 font-medium">{o.sku ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{o.courier ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[120px] truncate" title={o.awb ?? ""}>
                  {o.awb ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{o.dispatchDate ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[o.status as keyof typeof STATUS_COLORS]
                    }`}
                  >
                    {STATUS_LABELS[o.status as keyof typeof STATUS_LABELS]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {o.settlementAmount != null ? (
                    <span className={o.settlementAmount > 0 ? "text-green-700" : "text-red-600"}>
                      ₹{o.settlementAmount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{o.paymentDate ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
