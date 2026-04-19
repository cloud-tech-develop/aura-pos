// Presentation interface for Catalog Module
export interface Presentation {
  id?: number;
  name: string;
  product_id: number;
  factor: number;
  barcode: string;
  cost_price: number;
  sale_price: number;
  default_purchase: boolean;
  default_sale: boolean;
  enterprise_id: number;
  isActive: boolean;
}
export interface PresentationRequest {
  name: string;
  description?: string;
  unitId?: string;
  quantity: number;
  barcode?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface PresentationResponse {
  message: string;
  error: boolean;
  data?: Presentation;
}

export interface PresentationListResponse {
  message: string;
  error: boolean;
  data?: Presentation[];
}
