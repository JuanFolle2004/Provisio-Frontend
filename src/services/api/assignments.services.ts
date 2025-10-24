import { httpClient } from '../httpClient';
import type { Assignment } from '../../types/api.types';

export const assignmentsService = {
  // Asignar producto a un grupo
  assignProduct: (data: {
    product_id: number;
    group_id: number;
    amount: number;
    bought: number;
  }) =>
    httpClient.post<{ data: Assignment }>('/assignments/assign', data),

  // Obtener una asignación específica
  getAssignment: (id: number) =>
    httpClient.get<{ data: Assignment }>(`/assignments/${id}`),

  // Actualizar asignación (por ejemplo, cantidad o estado de compra)
  updateAssignment: (data: {
    assignment_id: number;
    amount: number;
    bought: number;
  }) =>
    httpClient.patch<{ data: Assignment }>('/assignments', data),

  // Eliminar asignación
  deleteAssignment: (id: number) =>
    httpClient.delete<null>(`/assignments/${id}`),
};
