import { createContext, useContext } from 'react';
import type { Product } from '../types/Products';
import type { CartItemDto } from '../types/CartDto';

interface CartContextType {
  cartItems: CartItemDto[];
  cartCount: number;
  isCartLoading: boolean;
  cartError: string | null;
  updatingProductId: number | null;
  addingProductId: number | null;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  refetchCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
