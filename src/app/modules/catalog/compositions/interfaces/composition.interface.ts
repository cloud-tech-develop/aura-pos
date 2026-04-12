// Composition interface for Catalog Module
export interface Composition {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompositionRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface CompositionResponse {
  message: string;
  error: boolean;
  data?: Composition;
}

export interface CompositionListResponse {
  message: string;
  error: boolean;
  data?: Composition[];
}