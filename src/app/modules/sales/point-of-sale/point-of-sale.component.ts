import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfSaleService } from './services/point-of-sale.service';
import { Product, CartItem } from './interfaces/product.interface';

@Component({
  selector: 'app-point-of-sale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.css']
})
export class PointOfSaleComponent {
  private posService = inject(PointOfSaleService);
  
  readonly selectedCategory = signal<string>('Todos');
  readonly searchQuery = signal<string>('');
  
  // Expose service data
  readonly categories = this.posService.categories;
  readonly products = this.posService.products;
  readonly cart = this.posService.cart;
  
  readonly filteredProducts = signal<Product[]>(this.products());
  
  constructor() {
    this.filterProducts();
  }
  
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.filterProducts();
  }
  
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.filterProducts();
  }
  
  filterProducts(): void {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();
    
    let filtered = this.products();
    
    if (category !== 'Todos') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    this.filteredProducts.set(filtered);
  }
  
  addToCart(product: Product): void {
    this.posService.addToCart(product);
  }
  
  removeFromCart(productId: number): void {
    this.posService.removeFromCart(productId);
  }
  
  clearCart(): void {
    this.posService.clearCart();
  }
  
  checkout(): void {
    if (this.cart().length === 0) return;
    
    const sale = this.posService.processSale();
    alert(`Venta procesada! ID: ${sale.id} - Total: $${sale.total.toFixed(2)}`);
  }
  
  getItemQuantity(productId: number): number {
    return this.posService.getItemQuantity(productId);
  }
  
  getCartTotal(): number {
    return this.posService.getCartTotal();
  }
  
  getCartItemCount(): number {
    return this.posService.getCartItemCount();
  }
}
