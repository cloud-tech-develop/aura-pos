export type CompositionType = 'KIT' | 'RECETA';

export interface Composition {
  id: number;
  parent_product_id: number;
  parent_name: string;
  child_product_id: number;
  child_name: string;
  quantity: number;
  type: CompositionType;
  enterprise_id?: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface CreateCompositionRequest {
  parent_product_id: number;
  child_product_id: number;
  quantity: number;
  type: CompositionType;
}

export interface UpdateCompositionRequest {
  quantity: number;
  type: CompositionType;
}
