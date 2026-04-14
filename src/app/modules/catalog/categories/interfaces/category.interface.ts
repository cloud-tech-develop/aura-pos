export interface Category {
  id: number;
  name: string;
  default_tax_rate: number;
  active: boolean;
  description?: string;
  parent_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryRequest {
  name: string;
  default_tax_rate?: number;
  active?: boolean;
  description?: string;
  parent_id?: number;
}
