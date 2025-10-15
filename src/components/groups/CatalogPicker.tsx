import { useMemo, useState } from 'react'

import type { CatalogItem } from '@/api/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CatalogPickerProps {
  trigger: React.ReactNode
  items: CatalogItem[]
  onSelect: (item: CatalogItem) => void
  isLoading?: boolean
}

export const CatalogPicker = ({ trigger, items, onSelect, isLoading }: CatalogPickerProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return items
    return items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  }, [items, search])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catálogo de sugerencias</DialogTitle>
          <DialogDescription>Elige un producto para agregar rápidamente a tu lista.</DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Buscar en el catálogo"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition hover:border-primary"
              onClick={() => {
                onSelect(item)
                setOpen(false)
              }}
              disabled={isLoading}
            >
              <span>
                <p className="font-medium">{item.name}</p>
                {item.category ? <p className="text-xs text-muted-foreground">{item.category}</p> : null}
              </span>
              <Button size="sm" variant="outline" disabled={isLoading}>
                Agregar
              </Button>
            </button>
          ))}
          {!filtered.length ? (
            <p className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
              No encontramos coincidencias
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
