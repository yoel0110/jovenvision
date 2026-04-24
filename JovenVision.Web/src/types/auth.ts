export interface AuthUser {
  id: number;
  username: string;
  role: string;
  token: string;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  token: string;
  username: string;
  role: string;
  expiresAt: string;
}
