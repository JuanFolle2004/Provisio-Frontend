import { httpClient } from '../httpClient';
import type { Group } from '../../types/api.types';

export const groupsService = {
  // Crear grupo
  createGroup: (data: { name: string; due_date: string }) =>
    httpClient.post<{ data: Group }>('/groups', data),

  // Obtener un grupo por ID
  getGroup: (id: number) =>
    httpClient.get<{ data: Group }>(`/groups/${id}`),
};
