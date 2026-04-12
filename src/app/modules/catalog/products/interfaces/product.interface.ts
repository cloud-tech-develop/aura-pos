// Product interface for Catalog Module
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  brandId?: string;
  unitId?: string;
  presentationId?: string;
  price: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  imageUrl?: string;
  isActive: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Request interface for creating/updating products
export interface ProductRequest {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  brandId?: string;
  unitId?: string;
  presentationId?: string;
  price: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  imageUrl?: string;
  isActive?: boolean;
  tags?: string[];
}

// Response from API
export interface ProductResponse {
  message: string;
  error: boolean;
  data?: Product;
}

// List response from API
export interface ProductListResponse {
  message: string;
  error: boolean;
  data?: Product[];
}

// Pagination request
export interface ProductPaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
}

// Pagination response
export interface ProductPaginationResponse {
  message: string;
  error: boolean;
  data?: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}