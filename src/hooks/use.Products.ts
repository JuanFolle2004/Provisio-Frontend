import { useState, useEffect, useCallback } from "react";
import { productService } from "@/services/api/products.service";
import type { Product } from "@/types/api.types";

interface UseProductsParams {
  groupId: number;
  is_free?: boolean;
  sort?: string;
  page?: number;
}

export const useProducts = (params: UseProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!params?.groupId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await productService.listProducts(params.groupId, {
        is_free: params.is_free,
        sort: params.sort,
        page: params.page,
      });
      // Laravel QueryBuilder devuelve { data: [...] } dentro del JSON
      setProducts(res.data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [params?.groupId, params?.is_free, params?.sort, params?.page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};
