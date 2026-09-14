"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Book, CartItem } from "./types";

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  justAdded: number | null;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "lampara-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, mounted]);

  const addItem = useCallback((book: Book) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
    setJustAdded(book.id);
    setTimeout(() => setJustAdded(null), 600);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((bookId: number) => {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.book.id !== bookId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.book.id === bookId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.book.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        justAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
