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

  if (!stats) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="In Transit / Awaiting Update" value={stats.pendingPaymentCount} />
        <StatCard label="Total Settlement Received" value={`₹${stats.totalSettlement.toFixed(2)}`} />
        <StatCard
          label="RTO Received Back"
          value={stats.statusCounts["RTO_RECEIVED"] ?? 0}
        />
      </div>

      <div className="border rounded-lg bg-white p-4">
        <h2 className="font-semibold mb-3">Orders by Status</h2>
        <div className="space-y-2">
          {Object.entries(STATUS_LABELS).map(([key, label]) => {
            const count = stats.statusCounts[key] ?? 0;
            if (count === 0) return null;
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[key as keyof typeof STATUS_COLORS]}`}>
                  {label}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            );
          })}
          {stats.totalOrders === 0 && (
            <p className="text-sm text-gray-400">
              No orders yet.{" "}
              <Link href="/upload" className="text-blue-600 hover:underline">
                Upload a manifest
              </Link>{" "}
              to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-lg bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
