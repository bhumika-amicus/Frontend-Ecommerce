import { useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../services/cartApi';
import { useAuth } from '../hooks/useAuth';
import { CartStateContext, CartActionsContext } from '../hooks/useCart';
import type { CartItemDto } from '../types/CartDto';
import type { Product } from '../types/Products';

// 1. Define Reducer Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QTY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItemDto[] };

// 2. Define the Reducer Function
function cartReducer(state: CartItemDto[], action: CartAction): CartItemDto[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.findIndex(item => item.productId === product.id);

      if (existingItemIndex >= 0) {
        const newState = [...state];
        const item = newState[existingItemIndex];
        const newQuantity = item.quantity + quantity;
        newState[existingItemIndex] = {
          ...item,
          quantity: newQuantity,
          itemSubtotal: item.price * newQuantity
        };
        return newState;
      } else {
        return [...state, {
          cartItemId: Date.now(), // Fallback local ID
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          price: product.price,
          itemSubtotal: product.price * quantity
        }];
      }
    }
    case 'UPDATE_QTY': {
      const { productId, quantity } = action.payload;
      return state.map(item => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
            itemSubtotal: item.price * quantity
          };
        }
        return item;
      });
    }
    case 'REMOVE_ITEM': {
      return state.filter(item => item.productId !== action.payload.productId);
    }
    case 'CLEAR_CART': {
      return [];
    }
    case 'SET_CART': {
      return action.payload; // Used for syncing with the backend
    }
    default:
      return state;
  }
}

// 3. Define the Rehydration (Initializer) Function
const initCart = (): CartItemDto[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Failed to parse cart from localStorage:', error);
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();

  // Initialize useReducer with the initCart function
  const [cartItems, dispatch] = useReducer(cartReducer, [], initCart);

  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const refetchCart = useCallback(() => setRefreshCount((prev) => prev + 1), []);

  // 4. Persistence Watcher: Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 5. Auth logout listener: clear cart state when user logs out
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: 'CLEAR_CART' });
      setIsCartLoading(false);
      setCartError(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // 6. Background Sync: Keep local storage updated with the real database
  useEffect(() => {
    if (!isLoggedIn) return;

    const controller = new AbortController();

    const syncCart = async () => {
      setIsCartLoading(true);
      setCartError(null);

      try {
        const apiCart = await getCart(controller.signal);
        if (controller.signal.aborted) return;
        dispatch({ type: 'SET_CART', payload: apiCart });
        setCartError(null);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to load cart:', error);
        if (!controller.signal.aborted) {
          setCartError(error instanceof Error ? error.message : 'Unable to sync cart.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCartLoading(false);
        }
      }
    };

    void syncCart();

    return () => controller.abort();
  }, [refreshCount, isLoggedIn]);

  const addToCart = useCallback(async (product: Product, quantity: number) => {
    const toastId = toast.loading(`Adding ${product.name} to cart...`);

    try {
      // 1. Update Backend
      await addCartItem(product.id, quantity);
      // 2. Dispatch Local Reducer Update (No getCart call!)
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
      toast.success(`${product.name} added to cart!`, { id: toastId });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      const message = error instanceof Error ? error.message : 'Failed to add item. Please try again.';
      toast.error(message, { id: toastId });
    }
  }, []);

  const updateQuantity = useCallback(async (productId: number, quantity: number): Promise<boolean> => {
    try {
      // 1. Update Backend
      await updateCartItem(productId, quantity);
      // 2. Dispatch Local Reducer Update
      dispatch({ type: 'UPDATE_QTY', payload: { productId, quantity } });
      toast.success('Cart updated');
      return true;
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      const message = error instanceof Error ? error.message : 'Failed to update quantity.';
      toast.error(message);
      return false;
    }
  }, []);

  const removeFromCart = useCallback(async (productId: number) => {
    const toastId = toast.loading('Removing item...');
    try {
      // 1. Update Backend
      await removeCartItem(productId);
      // 2. Dispatch Local Reducer Update
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
      toast.success('Item removed from cart', { id: toastId });
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove item.';
      toast.error(message, { id: toastId });
    }
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const actionsValue = useMemo(() => ({
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart,
  }), [
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart,
  ]);

  const stateValue = useMemo(() => ({
    cartItems,
    cartCount,
    isCartLoading,
    cartError,
    updatingProductId: null,
    addingProductId: null,
  }), [
    cartItems,
    cartCount,
    isCartLoading,
    cartError,
  ]);

  return (
    <CartActionsContext.Provider value={actionsValue}>
      <CartStateContext.Provider value={stateValue}>
        {children}
      </CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}
