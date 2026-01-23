"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price?: string;
  imageUrl?: string | null;
  quantity: number;
};

const STORAGE_KEY = "shoply_cart_v1";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setItems(readCart());
      setLoaded(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cart:updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:updated", sync);
    };
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    const current = readCart();
    const existing = current.find((c) => c.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({ ...item, quantity });
    }
    writeCart(current);
    setItems(current);
  }, []);

  const removeItem = useCallback((id: string) => {
    const current = readCart().filter((c) => c.id !== id);
    writeCart(current);
    setItems(current);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const current = readCart().map((c) => (c.id === id ? { ...c, quantity: Math.max(1, quantity) } : c));
    writeCart(current);
    setItems(current);
  }, []);

  const clearCart = useCallback(() => {
    writeCart([]);
    setItems([]);
  }, []);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return { items, loaded, count, addItem, removeItem, updateQuantity, clearCart };
}
