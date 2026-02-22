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

export interface User extends LoginData {}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};
