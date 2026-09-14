type OrderStatus = "Pending" | "Completed" | "Cancelled" | "Refunded";

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  Pending: {
    label: "Pending",
    bg: "bg-[#F5F0E6]",
    text: "text-[var(--color-accent)]",
  },
  Completed: {
    label: "Completed",
    bg: "bg-[#E8F0EB]",
    text: "text-[var(--color-primary)]",
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-[var(--color-surface-2)]",
    text: "text-[var(--color-muted)]",
  },
  Refunded: {
    label: "Refunded",
    bg: "bg-[var(--color-error-soft)]",
    text: "text-[var(--color-error)]",
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? statusConfig.Pending;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
