import { httpClient } from '../httpClient';
import type { Assignment } from '../../types/api.types';

export const assignmentsService = {
  listAssignments: () =>
    httpClient.get<{ data: Assignment[] }>("/assignments"),

  // PUT /assignments
  updateAssignment: (assignmentId: number, amount: number, bought: number) =>
    httpClient.put<{ data: Assignment }>("/assignments", {
      assignment_id: assignmentId,
      amount,
      bought,
    }),
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

  // Eliminar asignación
  deleteAssignment: (id: number) =>
    httpClient.delete<null>(`/assignments/${id}`),
};
