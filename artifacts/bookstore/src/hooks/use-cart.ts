import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, OrderItem } from '@workspace/api-client-react';

export interface CartItem extends OrderItem {
  imageUrl?: string | null;
  condition: string;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (book, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.bookId === book.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.bookId === book.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                bookId: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity,
                imageUrl: book.imageUrl,
                condition: book.condition,
              },
            ],
          };
        });
      },
      removeItem: (bookId) => {
        set((state) => ({
          items: state.items.filter((i) => i.bookId !== bookId),
        }));
      },
      updateQuantity: (bookId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.bookId !== bookId) };
          }
          return {
            items: state.items.map((i) =>
              i.bookId === bookId ? { ...i, quantity } : i
            ),
          };
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'pageturn-cart-storage',
    }
  )
);
