// Unit interface for Catalog Module
export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitRequest {
  name: string;
  abbreviation: string;
  description?: string;
  isActive?: boolean;
}

export interface UnitResponse {
  message: string;
  error: boolean;
  data?: Unit;
}

export interface UnitListResponse {
  message: string;
  error: boolean;
  data?: Unit[];
}