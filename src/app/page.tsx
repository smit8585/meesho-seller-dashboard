"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/statusMapping";

interface Stats {
  totalOrders: number;
  statusCounts: Record<string, number>;
  totalSettlement: number;
  pendingPaymentCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Loading...
      </div>
    );
  }

  const rtoCount = (stats.statusCounts["RTO_RECEIVED"] ?? 0) + (stats.statusCounts["RTO_INITIATED"] ?? 0);
  const deliveredCount = (stats.statusCounts["DELIVERED"] ?? 0) + (stats.statusCounts["PAYMENT_RECEIVED"] ?? 0);
  const inFlightCount = stats.pendingPaymentCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your complete order visibility from dispatch to payment.
        </p>
      </div>

      {stats.totalOrders === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Orders" value={stats.totalOrders} color="blue" />
            <StatCard
              label="Delivered / Paid"
              value={deliveredCount}
              color="green"
            />
            <StatCard label="In Transit / Awaiting" value={inFlightCount} color="indigo" />
            <StatCard label="RTO Received Back" value={rtoCount} color="red" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">Settlement Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Settlement Received</span>
                  <span className="font-bold text-green-700 text-lg">
                    ₹{stats.totalSettlement.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Orders Awaiting Payment</span>
                  <span className="font-semibold text-indigo-700">{inFlightCount}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-xl bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">Orders by Status</h2>
              <div className="space-y-2">
                {Object.entries(STATUS_LABELS).map(([key, label]) => {
                  const count = stats.statusCounts[key] ?? 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / stats.totalOrders) * 100);
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium min-w-[140px] ${STATUS_COLORS[key as keyof typeof STATUS_COLORS]}`}
                      >
                        {label}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/orders"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              View All Orders →
            </Link>
            <Link
              href="/upload"
              className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Upload Files
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "blue" | "green" | "indigo" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    green: "bg-green-50 border-green-100 text-green-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    red: "bg-red-50 border-red-100 text-red-700",
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
      <div className="text-5xl mb-4">📦</div>
      <h2 className="text-lg font-semibold text-gray-700">No orders yet</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
        Start by uploading a manifest from Meesho. Each sub-order will be tracked
        from dispatch through delivery and payment.
      </p>
      <Link
        href="/upload"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        Upload Your First Manifest
      </Link>
    </div>
  );
}
