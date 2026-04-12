// Tag interface for Catalog Module
export interface Tag {
  id: string;
  name: string;
  color?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagRequest {
  name: string;
  color?: string;
  isActive?: boolean;
}

export interface TagResponse {
  message: string;
  error: boolean;
  data?: Tag;
}

export interface TagListResponse {
  message: string;
  error: boolean;
  data?: Tag[];
}