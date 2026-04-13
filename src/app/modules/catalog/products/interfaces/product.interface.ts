// Product interface for Catalog Module
export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  cost_price: number;
  sale_price: number;
  tax_rate?: number;
  min_stock?: number;
  image_url?: string;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

// Request interfaces for creating/updating products
export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  cost_price: number;
  sale_price: number;
  tax_rate?: number;
  min_stock?: number;
  image_url?: string;
  status?: ProductStatus;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  cost_price?: number;
  sale_price?: number;
  min_stock?: number;
  image_url?: string;
  status?: ProductStatus;
}

// API Response interfaces
export interface ProductResponse {
  message: string;
  success: boolean;
  data?: Product;
}

export interface ProductListResponse {
  message: string;
  success: boolean;
  data: Product[];
  pagination?: ProductPagination;
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
