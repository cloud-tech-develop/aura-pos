export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  status: 'active' | 'inactive';
}
