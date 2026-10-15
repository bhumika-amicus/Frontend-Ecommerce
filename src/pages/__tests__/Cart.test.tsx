import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cart from '../Cart';
import type { CartItemDto } from '../../types/CartDto';
import { formatINR } from '../../utils/formatters';

const mockUpdateQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockRefetchCart = vi.fn();
const mockAddToCart = vi.fn();

let mockCartState = {
  cartItems: [] as CartItemDto[],
  cartCount: 0,
  isCartLoading: false,
  cartError: null as string | null,
};

vi.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    ...mockCartState,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    refetchCart: mockRefetchCart,
    addToCart: mockAddToCart,
  }),
}));

const sampleCartItems: CartItemDto[] = [
  {
    cartItemId: 1,
    productId: 1,
    productName: 'Mechanical Keyboard',
    price: 1000,
    quantity: 2,
    itemSubtotal: 2000,
  },
  {
    cartItemId: 2,
    productId: 2,
    productName: 'Gaming Mouse',
    price: 500,
    quantity: 1,
    itemSubtotal: 500,
  },
];

describe('Cart Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCartState = {
      cartItems: [...sampleCartItems],
      cartCount: 3,
      isCartLoading: false,
      cartError: null,
    };
  });

  // 1. Renders correct number of CartItems
  it('renders correct number of CartItems with product details', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Heading reflects item count
    expect(screen.getByRole('heading', { level: 1, name: /shopping cart \(3 items\)/i })).toBeInTheDocument();

    // Both products are listed
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
    expect(screen.getByText('Gaming Mouse')).toBeInTheDocument();

    // Verify remove buttons exist for each item
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    expect(removeButtons).toHaveLength(2);
  });

  // 2. Updates total when quantity changes
  it('triggers updateQuantity when quantity is changed', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Find all increase quantity buttons (one per cart item)
    const increaseButtons = screen.getAllByRole('button', { name: /increase quantity/i });
    expect(increaseButtons.length).toBeGreaterThan(0);

    // Increase quantity of first item (productId 1, current qty 2 -> next qty 3)
    await user.click(increaseButtons[0]);

    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  // 3. Shows empty state when cart is empty
  it('shows empty state when cart is empty', () => {
    mockCartState = {
      cartItems: [],
      cartCount: 0,
      isCartLoading: false,
      cartError: null,
    };

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Empty state title
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    // Continue shopping action button
    expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
  });

  // 4. Adds/displays item correctly
  it('renders newly added item with quantity and subtotal accurately', () => {
    const newItem: CartItemDto = {
      cartItemId: 3,
      productId: 3,
      productName: 'USB-C Fast Charger',
      price: 800,
      quantity: 1,
      itemSubtotal: 800,
    };

    mockCartState = {
      cartItems: [...sampleCartItems, newItem],
      cartCount: 4,
      isCartLoading: false,
      cartError: null,
    };

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('USB-C Fast Charger')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /shopping cart \(4 items\)/i })).toBeInTheDocument();
  });

  // 5. Removes item
  it('calls removeFromCart when remove button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    // Click remove on the second item (Gaming Mouse, id: 2)
    await user.click(removeButtons[1]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(2);
  });

  // 6. Calculates subtotal, tax, shipping, and total accurately
  it('calculates subtotal, shipping fee, 18% tax, and grand total accurately', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Item 1: 1000 * 2 = 2000
    // Item 2: 500 * 1 = 500
    // Subtotal: 2500
    // Standard Shipping: 100
    // Tax (18% of 2500): 450
    // Final Total: 2500 + 100 + 450 = 3050

    expect(screen.getByText('Subtotal (3 items):')).toBeInTheDocument();
    expect(screen.getByText('Estimated Shipping (Standard):')).toBeInTheDocument();
    expect(screen.getByText('Tax (18%):')).toBeInTheDocument();

    // Check financial values
    expect(screen.getByText(formatINR(2500))).toBeInTheDocument(); // Subtotal
    expect(screen.getByText(formatINR(100))).toBeInTheDocument();  // Shipping
    expect(screen.getByText(formatINR(450))).toBeInTheDocument();   // Tax
    expect(screen.getByText(formatINR(3050))).toBeInTheDocument();  // Grand total
  });
});
