export interface CartItemDto {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
