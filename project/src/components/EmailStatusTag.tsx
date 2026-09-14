import { Mail, CheckCircle, XCircle } from "lucide-react";

export default function EmailStatusTag({ sent }: { sent: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        sent ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
      }`}
    >
      {sent ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      <Mail className="h-3.5 w-3.5" />
      {sent ? "ส่งอีเมลแล้ว" : "ส่งอีเมลไม่สำเร็จ"}
    </span>
  );
}
