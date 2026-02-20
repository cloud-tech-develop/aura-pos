import { TestBed } from '@angular/core/testing';
import { PointOfSaleService } from './point-of-sale.service';
import { Product } from '../interfaces/product.interface';

describe('PointOfSaleService', () => {
  let service: PointOfSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PointOfSaleService],
    });

    service = TestBed.inject(PointOfSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have empty cart initially', () => {
      expect(service.cart()).toEqual([]);
    });

    it('should have default products', () => {
      const products = service.products();
      expect(products.length).toBe(12);
    });

    it('should have default categories', () => {
      expect(service.categories).toEqual(['Todos', 'Bebidas', 'Comidas', 'Postres', 'Snacks']);
    });
  });

  describe('addToCart', () => {
    const testProduct: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };

    it('should add new item to cart', () => {
      service.addToCart(testProduct);
      const cart = service.cart();
      expect(cart.length).toBe(1);
      expect(cart[0].id).toBe(1);
      expect(cart[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      service.addToCart(testProduct);
      service.addToCart(testProduct);
      const cart = service.cart();
      expect(cart.length).toBe(1);
      expect(cart[0].quantity).toBe(2);
    });

    it('should add multiple different products', () => {
      const product2: Product = { id: 2, name: 'Café Latte', price: 55, category: 'Bebidas' };
      service.addToCart(testProduct);
      service.addToCart(product2);
      const cart = service.cart();
      expect(cart.length).toBe(2);
    });
  });

  describe('removeFromCart', () => {
    const testProduct: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };

    beforeEach(() => {
      service.addToCart(testProduct);
      service.addToCart(testProduct);
    });

    it('should decrement quantity when quantity > 1', () => {
      service.removeFromCart(1);
      const cart = service.cart();
      expect(cart.length).toBe(1);
      expect(cart[0].quantity).toBe(1);
    });

    it('should remove item when quantity becomes 0', () => {
      service.removeFromCart(1);
      service.removeFromCart(1);
      const cart = service.cart();
      expect(cart.length).toBe(0);
    });

    it('should do nothing for non-existent product', () => {
      service.removeFromCart(999);
      const cart = service.cart();
      expect(cart.length).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);
      service.addToCart(product);
      service.clearCart();
      expect(service.cart().length).toBe(0);
    });

    it('should handle clearing empty cart', () => {
      service.clearCart();
      expect(service.cart().length).toBe(0);
    });
  });

  describe('getCartTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getCartTotal()).toBe(0);
    });

    it('should calculate total correctly for single item', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);
      expect(service.getCartTotal()).toBe(45);
    });

    it('should calculate total correctly for multiple items', () => {
      const product1: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      const product2: Product = { id: 2, name: 'Café Latte', price: 55, category: 'Bebidas' };
      service.addToCart(product1); // 45
      service.addToCart(product1); // 45 more = 90
      service.addToCart(product2); // 55
      expect(service.getCartTotal()).toBe(145);
    });

    it('should account for quantity', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);
      service.addToCart(product);
      service.addToCart(product);
      expect(service.getCartTotal()).toBe(135);
    });
  });

  describe('getCartItemCount', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getCartItemCount()).toBe(0);
    });

    it('should return correct count for single items', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);
      expect(service.getCartItemCount()).toBe(1);
    });

    it('should return correct count with quantities', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);
      service.addToCart(product);
      service.addToCart(product);
      expect(service.getCartItemCount()).toBe(3);
    });

    it('should return correct count for multiple products', () => {
      const product1: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      const product2: Product = { id: 2, name: 'Café Latte', price: 55, category: 'Bebidas' };
      service.addToCart(product1);
      service.addToCart(product1);
      service.addToCart(product2);
      expect(service.getCartItemCount()).toBe(3);
    });
  });

  describe('getItemQuantity', () => {
    const testProduct: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };

    it('should return 0 for item not in cart', () => {
      expect(service.getItemQuantity(999)).toBe(0);
    });

    it('should return correct quantity for item in cart', () => {
      service.addToCart(testProduct);
      service.addToCart(testProduct);
      expect(service.getItemQuantity(1)).toBe(2);
    });
  });

  describe('processSale', () => {
    it('should create sale with correct data', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);

      const sale = service.processSale('Efectivo');

      expect(sale.items.length).toBe(1);
      expect(sale.total).toBe(45);
      expect(sale.paymentMethod).toBe('Efectivo');
      expect(sale.id).toContain('SALE-');
      expect(sale.date).toBeInstanceOf(Date);
    });

    it('should clear cart after processing sale', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);

      service.processSale();

      expect(service.cart().length).toBe(0);
    });

    it('should handle sale with different payment methods', () => {
      const product: Product = { id: 1, name: 'Café Americano', price: 45, category: 'Bebidas' };
      service.addToCart(product);

      const saleCard = service.processSale('Tarjeta');
      expect(saleCard.paymentMethod).toBe('Tarjeta');

      service.addToCart(product);
      const saleTransfer = service.processSale('Transferencia');
      expect(saleTransfer.paymentMethod).toBe('Transferencia');
    });

    it('should return empty sale for empty cart', () => {
      const sale = service.processSale();
      expect(sale.items.length).toBe(0);
      expect(sale.total).toBe(0);
    });
  });

  describe('Products', () => {
    it('should have products in correct categories', () => {
      const products = service.products();
      const beverages = products.filter(p => p.category === 'Bebidas');
      const meals = products.filter(p => p.category === 'Comidas');
      const desserts = products.filter(p => p.category === 'Postres');

      expect(beverages.length).toBe(5);
      expect(meals.length).toBe(4);
      expect(desserts.length).toBe(3);
    });

    it('should have products with valid prices', () => {
      const products = service.products();
      products.forEach(product => {
        expect(product.price).toBeGreaterThan(0);
      });
    });
  });
});
