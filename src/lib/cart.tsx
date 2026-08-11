import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./shop-api";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

const STORAGE_KEY = "minishop.cart.v1";
export const TAX_RATE = 0.2;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  taxes: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  remove: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxes = subtotal * TAX_RATE;
    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      taxes,
      total: subtotal + taxes,
      add: (product, quantity = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.id === product.id);
          if (existing) {
            return prev.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            );
          }
          return [
            ...prev,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.images[0],
              category: product.category?.name ?? "Divers",
              quantity,
            },
          ];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQuantity: (id, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
        ),
      clear: () => setItems([]),
      isOpen,
      setOpen,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
