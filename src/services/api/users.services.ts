import { httpClient } from '../httpClient';
import type { User, LoginResponse, PaginatedResponse } from '../../types/api.types';

export const usersService = {
  // Registro de usuario
  signUp: (data: {
    name: string;
    email_address: string;
    password: string;
    password_confirmation: string;
    username: string;
  }) => httpClient.post<{ data: User }>('/users', data),

  // Inicio de sesión
  login: (data: { email: string; password: string }) =>
    httpClient.post<LoginResponse>('/users/login', data),

  // Obtener lista paginada de usuarios (con filtros y orden)
  getUsers: (params?: { page?: number; filter?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.filter) query.append('filter[email]', params.filter);
    if (params?.sort) query.append('sort', params.sort);
    
    return httpClient.get<PaginatedResponse<User>>(
      `/users${query.toString() ? '?' + query.toString() : ''}`
    );
  },

  // Obtener un usuario por ID
  getUser: (id: number) => httpClient.get<{ data: User }>(`/users/${id}`),

  getMe: () => httpClient.get<{ data: User }>(`/me`),

  // Actualizar datos de usuario
  updateUser: (
    id: number,
    data: {
      name: string;
      email_address: string;
      password: string;
      password_confirmation: string;
      username: string;
    }
  ) => httpClient.put<{ data: User }>(`/users/${id}`, data),

  // Eliminar un usuario
  deleteUser: (id: number) => httpClient.delete<{}>(`/users/${id}`),
};
