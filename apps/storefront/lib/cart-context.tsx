'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { medusa } from './medusa/client';
import type { MedusaCart } from './medusa/types';
import { toast } from 'sonner';

type CartContextValue = {
  cart: MedusaCart | null;
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number, productTitle?: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'eledante_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const ensureCart = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    const existingId = window.localStorage.getItem(STORAGE_KEY);
    if (existingId) {
      try {
        const { cart } = await medusa.carts.retrieve(existingId);
        setCart(cart);
        return cart;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    const { cart } = await medusa.carts.create();
    window.localStorage.setItem(STORAGE_KEY, cart.id);
    setCart(cart);
    return cart;
  }, []);

  useEffect(() => {
    ensureCart().catch((e) => console.error('Failed to initialise cart', e));
  }, [ensureCart]);

  const refresh = useCallback(async () => {
    if (!cart) return;
    const { cart: fresh } = await medusa.carts.retrieve(cart.id);
    setCart(fresh);
  }, [cart]);

  const addItem = useCallback<CartContextValue['addItem']>(async (variantId, quantity = 1, productTitle) => {
    setLoading(true);
    try {
      const c = (await ensureCart())!;
      const { cart: updated } = await medusa.carts.addLineItem(c.id, variantId, quantity);
      setCart(updated);
      setIsOpen(true);
      toast.success(productTitle ? `Added — ${productTitle}` : 'Added to bag', {
        description: 'View your bag to continue to checkout.',
      });
    } catch (e: any) {
      toast.error('Could not add to bag', { description: e?.message });
    } finally {
      setLoading(false);
    }
  }, [ensureCart]);

  const updateQuantity = useCallback<CartContextValue['updateQuantity']>(async (lineId, quantity) => {
    if (!cart) return;
    setLoading(true);
    try {
      const { cart: updated } = await medusa.carts.updateLineItem(cart.id, lineId, quantity);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback<CartContextValue['removeItem']>(async (lineId) => {
    if (!cart) return;
    setLoading(true);
    try {
      const { cart: updated } = await medusa.carts.removeLineItem(cart.id, lineId);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
