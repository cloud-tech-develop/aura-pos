import { StatusCommon } from '@core/interfaces';

// Presentation interface for Catalog Module
export interface Presentation {
  id?: number;
  name: string;
  product_id: number;
  product_name: string;
  product_type: string;
  category_name: string | null;
  brand_name: string | null;
  factor: number;
  barcode?: string;
  cost_price?: number;
  sale_price?: number;
  default_purchase?: boolean;
  default_sale?: boolean;
  enterprise_id?: number;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface PresentationRequest {
  name: string;
  product_id?: number;
  factor?: number;
  barcode?: string;
  cost_price?: number;
  sale_price?: number;
  default_purchase?: boolean;
  default_sale?: boolean;
  isActive?: boolean;
}

export interface PresentationResponse {
  message: string;
  success: boolean;
  data?: Presentation;
}

export interface PresentationListResponse {
  items: Presentation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Pagination request
export interface PresentationPaginationRequest {
  page?: number;
  limit?: number;
  first?: number;
  rows?: number;
  search?: string;
}

export interface PresentationPageResponse {
  items: Presentation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
