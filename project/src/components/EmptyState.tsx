import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      {Icon && (
        <Icon className="h-12 w-12 text-[var(--color-muted)] opacity-40" />
      )}
      <div>
        <p className="font-display text-lg font-semibold text-[var(--color-ink)]">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-2">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
