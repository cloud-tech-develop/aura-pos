export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
}
