"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readCartFromStorage, writeCartToStorage } from "./storage";
import type { AddCartItemInput, CartItem } from "./types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: AddCartItemInput) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function createCartItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeCartToStorage(items);
  }, [items, isHydrated]);

  const addItem = useCallback((item: AddCartItemInput) => {
    setItems((current) => [
      ...current,
      {
        ...item,
        id: createCartItemId(),
        quantity: 1,
      },
    ]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
    }),
    [items, itemCount, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
