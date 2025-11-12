import { httpClient } from '../httpClient';
import type { Product } from "@/types/api.types";


export const productService = {
  // Crear productos
  createProducts: (groupId: number, products: { name: string; amount: number }[]) =>
    httpClient.post<{ data: Product[] }>("/products", {
      group_id: groupId,
      products,
    }),

  // Listar productos
  listProducts: (
    groupId: number,
    params?: { is_free?: boolean; sort?: string; page?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.is_free !== undefined) query.append("filter[is_free]", String(params.is_free));
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", String(params.page));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return httpClient.get<{ data: Product[] }>(`/products/${groupId}${queryString}`);
  },
};
