// Presentation interface for Catalog Module
export interface Presentation {
  id: string;
  name: string;
  description?: string;
  unitId?: string;
  quantity: number;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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