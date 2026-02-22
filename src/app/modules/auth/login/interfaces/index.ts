import { ResponseBase } from '@core/interfaces';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  token: string;
  tipoToken: string;
  usuarioId: number;
  username: string;
  nombreCompleto: string;
  rol: string;
  sucursales: Sucursale[];
}

export interface Sucursale {
  id: number;
  nombre: string;
  esDefault: any;
}

export interface LoginResponse extends ResponseBase<LoginData> {}
