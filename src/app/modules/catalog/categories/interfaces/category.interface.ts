// Category interface for Catalog Module
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  message: string;
  error: boolean;
  data?: Category;
}

export interface CategoryListResponse {
  message: string;
  error: boolean;
  data?: Category[];
}

export interface CategoryTreeResponse {
  message: string;
  error: boolean;
  data?: Category[];
}