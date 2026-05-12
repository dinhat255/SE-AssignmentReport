import { apiGet, type ApiUser } from './client';

export const userApi = {
  getMe() {
    return apiGet<ApiUser>('/api/users/me');
  },
};
