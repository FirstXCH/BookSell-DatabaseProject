"use client";

import { useCart } from "@/lib/cart-context";
import { Plus, Check } from "lucide-react";
import type { Book } from "@/lib/types";

export default function AddToCartButton({ book }: { book: Book }) {
  const { addItem, justAdded } = useCart();
  const isAdded = justAdded === book.id;

  return (
    <button
      onClick={() => addItem(book)}
      className={`btn-primary ${isAdded ? "!bg-[var(--color-success)]" : ""}`}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4" />
          หยิบแล้ว
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          หยิบใส่ตะกร้า
        </>
      )}
    </button>
  );
}
