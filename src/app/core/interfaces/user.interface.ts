export interface LoginData {
  token: string;
  enterprise: Enterprise;
  user: UserInfo;
}

export interface Enterprise {
  id: number;
  slug: string;
  tenant_id: number;
}

export interface UserInfo {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export interface User extends UserInfo {
  token: string;
  enterprise: Enterprise;
}

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