import { createContext, useContext } from 'react';
import type { Product } from '../types/Products';
import type { CartItemDto } from '../types/CartDto';

export interface CartStateType {
  cartItems: CartItemDto[];
  cartCount: number;
  isCartLoading: boolean;
  cartError: string | null;
  updatingProductId: number | null;
  addingProductId: number | null;
}

export interface CartActionsType {
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  refetchCart: () => void;
}

export type CartContextType = CartStateType & CartActionsType;

export const CartStateContext = createContext<CartStateType | undefined>(undefined);
export const CartActionsContext = createContext<CartActionsType | undefined>(undefined);

// Alias CartContext to CartStateContext for backwards-compatibility
export const CartContext = CartStateContext;

export function useCartState(): CartStateType {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
}

export function useCartActions(): CartActionsType {
  const context = useContext(CartActionsContext);
  if (context === undefined) {
    throw new Error('useCartActions must be used within a CartProvider');
  }
  return context;
}

/**
 * Combined hook for components that require both state and actions.
 */
export function useCart(): CartContextType {
  const state = useCartState();
  const actions = useCartActions();
  return { ...state, ...actions };
}
