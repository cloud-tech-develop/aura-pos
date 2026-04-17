import { ListId } from '@core/interfaces';

// Unit interface for Catalog Module
export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
  active: boolean;
  allow_decimals: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UnitRequest {
  name: string;
  abbreviation: string;
  active?: boolean;
  allow_decimals?: boolean;
}

export interface UnitList extends ListId {
  abbreviation: string;
}
