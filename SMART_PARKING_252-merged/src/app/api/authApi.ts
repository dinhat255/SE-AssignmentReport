import { apiPost, type ApiUser } from './client';

export interface LoginRequest {
  email: string;
  password: string;
  provider: 'HCMUT_SSO' | 'LOCAL';
}

export interface LoginResponse {
  accessToken: string;
  user: ApiUser;
}

export const authApi = {
  login(payload: LoginRequest) {
    return apiPost<LoginResponse, LoginRequest>('/api/auth/login', payload);
  },
};
