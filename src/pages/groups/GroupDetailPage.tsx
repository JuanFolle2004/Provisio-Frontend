import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useParams } from 'react-router-dom'

import { createProduct, createProductFromCatalog, getCatalog, getGroupDetail, inviteMember, updateProductStatus } from '@/api/groups'
import type { CatalogItem, GroupFilters, ProductItem, ProductStatus } from '@/api/types'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { EmptyState, PageHeader } from '@/components/common'
import { CatalogPicker, MemberInvite, ProductList } from '@/components/groups'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const GroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const [filters, setFilters] = useState<GroupFilters>({ status: 'all' })
  const [activeTab, setActiveTab] = useState('products')
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 1, notes: '' })
  const queryClient = useQueryClient()

  const groupQuery = useQuery({
    queryKey: ['groups', groupId, 'detail', filters],
    queryFn: () => getGroupDetail(groupId!, filters),
    enabled: Boolean(groupId),
  })

  const catalogQuery = useQuery({
    queryKey: ['catalog'],
    queryFn: getCatalog,
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ productId, status }: { productId: string; status: ProductStatus }) =>
      updateProductStatus(groupId!, productId, status),
    onSuccess: () => {
      toast.success('Producto actualizado')
      void queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'detail'] })
    },
    onError: () => toast.error('No pudimos actualizar el producto'),
  })

  const createProductMutation = useMutation({
    mutationFn: () =>
      createProduct(groupId!, {
        name: newProduct.name,
        quantity: Number(newProduct.quantity) || 1,
        notes: newProduct.notes || undefined,
      }),
    onSuccess: () => {
      toast.success('Producto agregado')
      setNewProduct({ name: '', quantity: 1, notes: '' })
      void queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'detail'] })
    },
    onError: () => toast.error('No pudimos agregar el producto'),
  })

  const createFromCatalogMutation = useMutation({
    mutationFn: (item: CatalogItem) => createProductFromCatalog(groupId!, item.id),
    onSuccess: () => {
      toast.success('Producto agregado desde el catálogo')
      void queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'detail'] })
    },
    onError: () => toast.error('No pudimos agregar el producto del catálogo'),
  })

  const inviteMutation = useMutation({
    mutationFn: (username: string) => inviteMember(groupId!, { username }),
    onSuccess: () => toast.success('Invitación enviada'),
    onError: () => toast.error('No pudimos enviar la invitación'),
  })

  const group = groupQuery.data

  const members = useMemo(() => group?.members ?? [], [group?.members])
  const products = useMemo(() => group?.products ?? [], [group?.products])

  const handleToggle = (product: ProductItem, status: ProductStatus) => {
    toggleStatusMutation.mutate({ productId: product.id, status })
  }

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newProduct.name.trim()) return
    createProductMutation.mutate()
  }

  if (groupQuery.isPending) {
    return <p className="text-sm text-muted-foreground">Cargando grupo…</p>
  }

  if (!group) {
    return <EmptyState title="Grupo no encontrado" description="Verifica la URL o regresa al panel principal." />
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={group.name}
        description={group.description ?? 'Organiza tus compras en equipo'}
        actions={
          <CatalogPicker
            trigger={<Button>Catálogo de productos</Button>}
            items={catalogQuery.data ?? []}
            onSelect={(item) => createFromCatalogMutation.mutate(item)}
            isLoading={createFromCatalogMutation.isPending}
          />
        }
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-6">
          <form onSubmit={handleAddProduct} className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="text-sm font-medium" htmlFor="new-product-name">
                Nombre
              </label>
              <Input
                id="new-product-name"
                value={newProduct.name}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Carne, bebidas…"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="new-product-quantity">
                Cantidad
              </label>
              <Input
                id="new-product-quantity"
                type="number"
                min={1}
                value={newProduct.quantity}
                onChange={(event) =>
                  setNewProduct((prev) => ({ ...prev, quantity: Number(event.target.value) }))
                }
              />
            </div>
            <div className="md:col-span-1 md:col-start-1 md:row-start-2">
              <label className="text-sm font-medium" htmlFor="new-product-notes">
                Notas
              </label>
              <Textarea
                id="new-product-notes"
                value={newProduct.notes}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, notes: event.target.value }))}
                rows={2}
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending ? 'Agregando…' : 'Agregar producto'}
              </Button>
            </div>
          </form>
          <ProductList
            products={products}
            filters={filters}
            onFiltersChange={setFilters}
            onToggleStatus={handleToggle}
          />
        </TabsContent>
        <TabsContent value="chat" className="min-h-[400px]">
          <ChatPanel groupId={groupId!} />
        </TabsContent>
        <TabsContent value="members" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Miembros</CardTitle>
              <CardDescription>Personas que colaboran en este grupo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{member.username}</p>
                    <p className="text-xs uppercase text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
              {!members.length ? (
                <p className="text-sm text-muted-foreground">Aún no hay miembros. ¡Invita a alguien!</p>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Invitar miembro</CardTitle>
              <CardDescription>Comparte el grupo con otras personas usando su usuario.</CardDescription>
            </CardHeader>
            <CardContent>
              <MemberInvite
                onInvite={async (username) => {
                  await inviteMutation.mutateAsync(username)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>Configura notificaciones y reglas del grupo.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Próximamente podrás personalizar notificaciones, recordatorios y automatizaciones.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
