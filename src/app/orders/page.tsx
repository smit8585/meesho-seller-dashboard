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
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by Sub Order No, AWB, or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1 max-w-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2">Sub Order No</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Courier</th>
              <th className="px-3 py-2">AWB</th>
              <th className="px-3 py-2">Dispatch Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Settlement</th>
              <th className="px-3 py-2">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                  No orders found. Upload a manifest to get started.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{o.subOrderNo}</td>
                <td className="px-3 py-2">{o.sku}</td>
                <td className="px-3 py-2">{o.courier}</td>
                <td className="px-3 py-2 font-mono text-xs">{o.awb}</td>
                <td className="px-3 py-2">{o.dispatchDate}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[o.status as keyof typeof STATUS_COLORS]}`}
                  >
                    {STATUS_LABELS[o.status as keyof typeof STATUS_LABELS]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {o.settlementAmount != null ? `₹${o.settlementAmount.toFixed(2)}` : "-"}
                </td>
                <td className="px-3 py-2">{o.paymentDate ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
