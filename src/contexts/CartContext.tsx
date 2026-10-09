import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../services/cartApi';
import { useAuth } from './AuthContext';
import type { CartItemDto } from '../types/CartDto';
import type { Product } from '../types/Products';

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  
  // Initialize useReducer with the initCart function
  const [cartItems, dispatch] = useReducer(cartReducer, [], initCart);

  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const [refreshCount, setRefreshCount] = useState(0);
  const refetchCart = useCallback(() => setRefreshCount((prev) => prev + 1), []);

  // 4. Persistence Watcher: Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 5. Background Sync: Keep local storage updated with the real database
  useEffect(() => {
    // If not logged in, absolutely ensure the cart is empty!
    if (!isLoggedIn) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    const controller = new AbortController();
    setIsCartLoading(true);
    setCartError(null);

    getCart(controller.signal)
      .then((apiCart) => {
        dispatch({ type: 'SET_CART', payload: apiCart }); // Sync background cart to reducer
      })
      .catch((error) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to load cart:', error);
        setCartError(error instanceof Error ? error.message : 'Unable to sync cart.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsCartLoading(false);
        }
      });

    return () => controller.abort();
  }, [refreshCount, isLoggedIn]);

  const addToCart = async (product: Product, quantity: number) => {
    if (addingProductId === product.id) return;

    setAddingProductId(product.id);
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
    } finally {
      setAddingProductId(null);
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<boolean> => {
    if (updatingProductId === productId) return false;
    setUpdatingProductId(productId);
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
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (updatingProductId === productId) return;
    setUpdatingProductId(productId);
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
    } finally {
      setUpdatingProductId(null);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isCartLoading,
        cartError,
        updatingProductId,
        addingProductId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
