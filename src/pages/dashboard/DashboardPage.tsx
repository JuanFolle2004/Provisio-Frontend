import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { createGroup, getGroups } from '@/api/groups'
import type { GroupSummary } from '@/api/types'
import { EmptyState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const DashboardPage = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '' })

  const { data, isPending } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  })

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] })
      const previous = queryClient.getQueryData<GroupSummary[]>(['groups'])
      queryClient.setQueryData<GroupSummary[]>(['groups'], (old = []) => [
        {
          id: crypto.randomUUID(),
          name: payload.name,
          description: payload.description,
          ownerId: 'optimistic',
          membersCount: 1,
          pendingProducts: 0,
          updatedAt: new Date().toISOString(),
        },
        ...old,
      ])
      return { previous }
    },
    onError: (_error, _variables, context) => {
      toast.error('No pudimos crear el grupo. Intenta otra vez.')
      if (context?.previous) {
        queryClient.setQueryData(['groups'], context.previous)
      }
    },
    onSuccess: (group) => {
      queryClient.setQueryData<GroupSummary[]>(['groups'], (old = []) =>
        [group, ...old.filter((item) => item.id !== 'optimistic')],
      )
      toast.success('Grupo creado')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })

  const handleCreateGroup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newGroup.name.trim()) return
    createGroupMutation.mutate({
      name: newGroup.name.trim(),
      description: newGroup.description.trim() || undefined,
    })
    setNewGroup({ name: '', description: '' })
    setIsCreating(false)
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Mis grupos"
        description="Gestiona tus compras y tareas compartidas"
        actions={
          <Button onClick={() => setIsCreating((prev) => !prev)} variant={isCreating ? 'secondary' : 'default'}>
            <Plus className="mr-2 h-4 w-4" />
            {isCreating ? 'Cerrar' : 'Nuevo grupo'}
          </Button>
        }
      />
      {isCreating ? (
        <form onSubmit={handleCreateGroup} className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="group-name">
              Nombre del grupo
            </label>
            <Input
              id="group-name"
              value={newGroup.name}
              onChange={(event) => setNewGroup((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Asado sábado"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="group-description">
              Descripción (opcional)
            </label>
            <Input
              id="group-description"
              value={newGroup.description}
              onChange={(event) => setNewGroup((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Lista de compras para el asado del sábado"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createGroupMutation.isPending}>
              {createGroupMutation.isPending ? 'Creando…' : 'Crear grupo'}
            </Button>
          </div>
        </form>
      ) : null}
      {isPending ? (
        <p className="text-sm text-muted-foreground">Cargando grupos…</p>
      ) : data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((group) => (
            <Link key={group.id} to={/groups/} className="group">
              <Card className="h-full transition hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {group.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      {new Date(group.updatedAt).toLocaleDateString()}
                    </span>
                  </CardTitle>
                  {group.description ? <CardDescription>{group.description}</CardDescription> : null}
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{group.membersCount} miembros</span>
                  <span>{group.pendingProducts} pendientes</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aún no tienes grupos"
          description="Crea tu primer grupo para organizar compras y tareas compartidas."
          action={
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />Crear grupo
            </Button>
          }
        />
      )}
    </section>
  )
}
