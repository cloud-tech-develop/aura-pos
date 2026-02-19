import { Injectable, signal } from '@angular/core';
import { Product, CartItem, Sale } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class PointOfSaleService {
  // Cart state
  private readonly cartSignal = signal<CartItem[]>([]);
  readonly cart = this.cartSignal.asReadonly();
  
  // Products
  readonly products = signal<Product[]>([
    { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' },
    { id: 2, name: 'Café Latte', price: 55, category: 'Bebidas' },
    { id: 3, name: 'Cappuccino', price: 55, category: 'Bebidas' },
    { id: 4, name: 'Té Verde', price: 35, category: 'Bebidas' },
    { id: 5, name: 'Jugo de Naranja', price: 40, category: 'Bebidas' },
    { id: 6, name: 'Sandwich de Pollo', price: 85, category: 'Comidas' },
    { id: 7, name: 'Hamburguesa', price: 120, category: 'Comidas' },
    { id: 8, name: 'Pizza Personal', price: 95, category: 'Comidas' },
    { id: 9, name: 'Ensalada César', price: 75, category: 'Comidas' },
    { id: 10, name: 'Pastel de Chocolate', price: 65, category: 'Postres' },
    { id: 11, name: 'Cheesecake', price: 70, category: 'Postres' },
    { id: 12, name: 'Helado', price: 40, category: 'Postres' },
  ]);
  
  // Categories
  readonly categories = ['Todos', 'Bebidas', 'Comidas', 'Postres', 'Snacks'];
  
  getCartTotal(): number {
    return this.cartSignal().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  getCartItemCount(): number {
    return this.cartSignal().reduce((sum, item) => sum + item.quantity, 0);
  }
  
  addToCart(product: Product): void {
    const currentCart = this.cartSignal();
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
      this.cartSignal.set([...currentCart]);
    } else {
      this.cartSignal.set([...currentCart, { ...product, quantity: 1 }]);
    }
  }
  
  removeFromCart(productId: number): void {
    const currentCart = this.cartSignal();
    const item = currentCart.find(item => item.id === productId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.cartSignal.set([...currentCart]);
      } else {
        this.cartSignal.set(currentCart.filter(item => item.id !== productId));
      }
    }
  }
  
  clearCart(): void {
    this.cartSignal.set([]);
  }
  
  processSale(paymentMethod: string = 'Efectivo'): Sale {
    const sale: Sale = {
      id: this.generateSaleId(),
      items: [...this.cartSignal()],
      total: this.getCartTotal(),
      date: new Date(),
      paymentMethod
    };
    
    this.clearCart();
    return sale;
  }
  
  getItemQuantity(productId: number): number {
    const item = this.cartSignal().find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
  
  private generateSaleId(): string {
    return 'SALE-' + Date.now().toString(36).toUpperCase();
  }
}
