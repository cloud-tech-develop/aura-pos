import { StatusCommon } from '@core/interfaces';

// Product interface for Catalog Module
export interface Product {
  id: number;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  category_id: number | null;
  category_name: string | null;
  brand_id: number | null;
  brand_name: string | null;
  unit_measure_id: number;
  unit_name: string;
  cost_price: number;
  sale_price: number;
  tax_rate: number | null;
  min_stock: number;
  current_stock: number;
  image_url: string | null;
  status: ProductStatus;
  enterprise_id: number;
  created_at?: string;
  updated_at?: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

// Request interfaces for creating/updating products

/**
 * Interface for creating a new product
 * Used when sending data to the API to create a product
 */
export interface ProductRequest {
  /** Product SKU (Stock Keeping Unit) - unique identifier */
  sku: string;

  /** Product barcode for scanning/lookup */
  barcode: string | null;

  /** Product name */
  name: string;

  /** Product description */
  description: string | null;

  /** Category ID (foreign key to categories table) */
  category_id: number | null;

  /** Brand ID (foreign key to brands table) */
  brand_id: number | null;

  /** Base unit of measure ID (foreign key to units table) */
  unit_measure_id: number | null;

  /** Product type (e.g., 'goods', 'service', 'composite') */
  product_type: string;

  /** Whether the product is active (true) or inactive (false) */
  active: boolean;

  /** Sale price (retail price) */
  sale_price: number;

  /** Cost price (purchase price from supplier) */
  cost_price: number;

  /** Secondary price (wholesale price) */
  price_2: number | null;

  /** Tertiary price (special price) */
  price_3: number | null;

  /** VAT/IVA percentage (0-100) */
  iva_percentage: number;

  /** Consumption tax (impoconsumo) - specific tax for certain products */
  consumption_tax: number;

  /** Whether the product tracks inventory levels */
  manages_inventory: boolean;

  /** Whether the product uses batch/lot tracking */
  manages_batches: boolean;

  /** Whether the product uses serial number tracking */
  manages_serial: boolean;

  /** Allow negative stock (selling when stock is zero) */
  allow_negative_stock: boolean;

  /** Visible in Point of Sale interface */
  visible_in_pos: boolean;

  /** Minimum stock level for low stock alerts */
  min_stock: number;

  /** Product image URL */
  image_url: string;

  /** Product status (ACTIVE, INACTIVE, DISCONTINUED) */
  status: ProductStatus;

  /** Product presentations (variants with different sizes/units) */
  presentations: any[];
}

// API Response interfaces
export interface ProductResponse {
  message: string;
  success: boolean;
  data?: Product;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Pagination
export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Pagination request
export interface ProductPaginationRequest {
  page?: number;
  limit?: number;
  first?: number;
  rows?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
}

export interface ProductPageResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
