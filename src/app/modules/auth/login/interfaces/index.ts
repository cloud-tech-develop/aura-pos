import { LoginData } from '@core/interfaces/user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export type { LoginData };