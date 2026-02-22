import { LoginData, ResponseBase } from '@core/interfaces';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends ResponseBase<LoginData> {}
export type { LoginData };
