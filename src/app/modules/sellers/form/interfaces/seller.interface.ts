export interface Seller {
  id?: number;
  name: string;
  email: string;
  phone: string;
  commission: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateSellerDto = Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSellerDto = Partial<CreateSellerDto>;
