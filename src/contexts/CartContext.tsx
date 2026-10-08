import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../services/cartApi';
import { initializeAuth } from '../services/auth';
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
  refetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  
  // Spam-click protection states
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  
  const [refreshCount, setRefreshCount] = useState(0);

  const refetchCart = useCallback(() => setRefreshCount((prev) => prev + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    setIsCartLoading(true);
    setCartError(null);

    // Ensure auth is initialized before fetching the cart
    initializeAuth()
      .then(() => getCart(controller.signal))
      .then(setCartItems)
      .catch((error) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to load cart:', error);
        setCartError(error instanceof Error ? error.message : 'Unable to load cart.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsCartLoading(false);
        }
      });

    return () => controller.abort();
  }, [refreshCount]);

  const addToCart = async (product: Product, quantity: number) => {
    // Prevent spam clicking
    if (addingProductId === product.id) return;
    
    setAddingProductId(product.id);
    const toastId = toast.loading(`Adding ${product.name} to cart...`);

    try {
      await addCartItem(product.id, quantity);
      const updatedCart = await getCart();
      setCartItems(updatedCart);
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
      await updateCartItem(productId, quantity);
      const updatedCart = await getCart();
      setCartItems(updatedCart);
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
      await removeCartItem(productId);
      const updatedCart = await getCart();
      setCartItems(updatedCart);
      toast.success('Item removed from cart', { id: toastId });
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove item.';
      toast.error(message, { id: toastId });
    } finally {
      setUpdatingProductId(null);
    }
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
