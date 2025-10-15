import { useMemo } from 'react'

import type { GroupFilters, ProductItem, ProductStatus } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const statusOrder: ProductStatus[] = ['pending', 'claimed', 'purchased']

const getNextStatus = (current: ProductStatus): ProductStatus => {
  const index = statusOrder.indexOf(current)
  return statusOrder[(index + 1) % statusOrder.length]
}

const statusLabel: Record<ProductStatus, string> = {
  pending: 'Pendiente',
  claimed: 'En progreso',
  purchased: 'Comprado',
}

const statusBadge: Record<ProductStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
  claimed: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100',
  purchased: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100',
}

interface ProductListProps {
  products: ProductItem[]
  filters: GroupFilters
  onFiltersChange: (filters: GroupFilters) => void
  onToggleStatus: (product: ProductItem, nextStatus: ProductStatus) => void
}

export const ProductList = ({ products, filters, onFiltersChange, onToggleStatus }: ProductListProps) => {
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = filters.search
        ? product.name.toLowerCase().includes(filters.search.toLowerCase())
        : true
      const matchesStatus = filters.status && filters.status !== 'all' ? product.status === filters.status : true
      return matchesSearch && matchesStatus
    })
  }, [products, filters])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Input
          value={filters.search ?? ''}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder="Buscar producto"
          className="md:col-span-2"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.status ?? 'all'}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              status: event.target.value as GroupFilters['status'],
            })
          }
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="claimed">En progreso</option>
          <option value="purchased">Comprados</option>
        </select>
      </div>
      <div className="grid gap-3">
        {filtered.map((product) => {
          const nextStatus = getNextStatus(product.status)
          return (
            <Card key={product.id} className="hover:border-primary/60">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    Cantidad: {product.quantity}
                    {product.category ?  ·  : ''}
                  </CardDescription>
                </div>
                <Badge className={statusBadge[product.status]}>{statusLabel[product.status]}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  {product.notes ? <p>{product.notes}</p> : null}
                  {product.assignedTo ? <p>Asignado a: {product.assignedTo.username}</p> : null}
                  <p>Actualizado: {new Date(product.updatedAt).toLocaleString()}</p>
                </div>
                <Button variant="secondary" onClick={() => onToggleStatus(product, nextStatus)}>
                  Marcar como {statusLabel[nextStatus]}
                </Button>
              </CardContent>
            </Card>
          )
        })}
        {!filtered.length ? (
          <Card className="border-dashed text-center text-sm text-muted-foreground">
            <CardHeader>
              <CardTitle className="text-base">No hay productos</CardTitle>
              <CardDescription>Agrega nuevos productos o ajusta los filtros para ver resultados.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
