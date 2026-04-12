// Brand interface for Catalog Module
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface BrandResponse {
  message: string;
  error: boolean;
  data?: Brand;
}

export interface BrandListResponse {
  message: string;
  error: boolean;
  data?: Brand[];
}