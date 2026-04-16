// Brand interface for Catalog Module
export interface Brand {
  id: number;
  name: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BrandRequest {
  name: string;
  active?: boolean;
}
