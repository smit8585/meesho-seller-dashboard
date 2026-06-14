export type OrderStatusKey =
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "RTO_INITIATED"
  | "RTO_RECEIVED"
  | "RETURN_INITIATED"
  | "RETURN_RECEIVED"
  | "CLAIM_INITIATED"
  | "CLAIM_RECEIVED"
  | "PAYMENT_RECEIVED"
  | "CANCELLED"
  | "UNKNOWN";

export function mapLiveStatus(liveOrderStatus: string, settlementAmount: number): OrderStatusKey {
  const s = liveOrderStatus.toLowerCase();

  if (s.includes("rto")) return "RTO_RECEIVED";
  if (s.includes("exchange") || s.includes("return")) return "RETURN_RECEIVED";
  if (s.includes("cancel")) return "CANCELLED";
  if (s.includes("deliver")) {
    return settlementAmount > 0 ? "PAYMENT_RECEIVED" : "DELIVERED";
  }
  if (s.includes("shipped") || s.includes("transit")) return "IN_TRANSIT";

  return "UNKNOWN";
}

export const STATUS_LABELS: Record<OrderStatusKey, string> = {
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  RTO_INITIATED: "RTO Initiated",
  RTO_RECEIVED: "RTO Received Back",
  RETURN_INITIATED: "Return Initiated",
  RETURN_RECEIVED: "Return Received",
  CLAIM_INITIATED: "Claim Initiated",
  CLAIM_RECEIVED: "Claim Received",
  PAYMENT_RECEIVED: "Payment Received",
  CANCELLED: "Cancelled",
  UNKNOWN: "Unknown",
};

export const STATUS_COLORS: Record<OrderStatusKey, string> = {
  DISPATCHED: "bg-blue-100 text-blue-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-teal-100 text-teal-800",
  RTO_INITIATED: "bg-orange-100 text-orange-800",
  RTO_RECEIVED: "bg-red-100 text-red-800",
  RETURN_INITIATED: "bg-orange-100 text-orange-800",
  RETURN_RECEIVED: "bg-red-100 text-red-800",
  CLAIM_INITIATED: "bg-yellow-100 text-yellow-800",
  CLAIM_RECEIVED: "bg-purple-100 text-purple-800",
  PAYMENT_RECEIVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  UNKNOWN: "bg-gray-100 text-gray-600",
};
