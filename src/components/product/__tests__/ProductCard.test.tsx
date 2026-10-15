import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from '../ProductCard';
import type { Product } from '../../../types/Products';

const mockAddToCart = vi.fn();
let mockIsLoggedIn = true;

vi.mock('../../../hooks/useCart', () => ({
  useCartActions: () => ({
    addToCart: mockAddToCart,
  }),
}));

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    isLoggedIn: mockIsLoggedIn,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockProduct: Product = {
  id: 101,
  name: 'Wireless Noise-Canceling Headphones',
  description: 'High-fidelity audio with active noise cancellation.',
  price: 4999,
  imageUrl: 'https://example.com/headphones.jpg',
  categoryId: 1,
  category: 'Electronics',
  brandId: 2,
  brand: 'AudioTech',
  rating: 4.5,
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoggedIn = true;
  });

  // 1. Renders name, price, and image
  it('renders product name, formatted price, and image alt text', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    // Name (heading role)
    const heading = screen.getByRole('heading', { level: 2, name: /wireless noise-canceling headphones/i });
    expect(heading).toBeInTheDocument();

    // Price
    expect(screen.getByText(/₹4,999/)).toBeInTheDocument();

    // Image with alt text
    const image = screen.getByRole('img', { name: mockProduct.name });
    expect(image).toBeInTheDocument();
  });

  // 2. Fires onClick when "ADD TO CART" is clicked
  it('fires addToCart when "ADD TO CART" button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeInTheDocument();

    await user.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  // 3. Updates quantity and price correctly before adding
  it('updates quantity and multiplies total price when quantity buttons are clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    // Increase quantity to 2
    const incrementBtn = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(incrementBtn);

    // Price should now reflect 4999 * 2 = 9998
    expect(screen.getByText(/₹9,998/)).toBeInTheDocument();

    // Click Add to Cart with quantity 2
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 2);
  });

  // 4. Handles missing optional props gracefully
  it('handles missing optional fields without crashing', () => {
    const minimalProduct: Product = {
      id: 202,
      name: 'Minimalist Notebook',
      description: '',
      price: 199,
      imageUrl: '',
      categoryId: 3,
      category: 'Stationery',
      brandId: 4,
      brand: 'PaperCo',
      rating: undefined as unknown as number,
    };

    render(
      <MemoryRouter>
        <ProductCard product={minimalProduct} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /minimalist notebook/i })).toBeInTheDocument();
    expect(screen.getByText(/₹199/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});
