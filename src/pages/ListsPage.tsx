import { useEffect, useState } from 'react'
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Plus, Trash2 } from "lucide-react";
import { getAuthToken } from '@/config/api.ts'
import { useNavigate } from 'react-router-dom'

interface Item {
  id: number;
  name: string;
  qty: number;
  done: boolean;
}

export default function ListsPage() {

  const token = getAuthToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);


  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Leche descremada 1L", qty: 6, done: false },
    { id: 2, name: "Papel higiénico x12", qty: 1, done: true },
  ]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  const addItem = () => {
    if (!name.trim()) return;
    setItems((prev) => [{ id: Date.now(), name, qty, done: false }, ...prev]);
    setName("");
    setQty(1);
  };

  const toggleDone = (id: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agregar producto</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Producto..."
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQty(Number(e.target.value) || 1)
              }
              className="w-24"
            />
            <Button onClick={addItem}>
              <Plus size={16} /> Agregar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mi lista</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
              {items.map((i) => (
                <li key={i.id} className="py-3 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={() => toggleDone(i.id)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${i.done ? "line-through opacity-60" : ""}`}>
                      {i.name}
                    </p>
                    <p className="text-xs text-gray-500">x{i.qty}</p>
                  </div>
                  <Button variant="ghost" onClick={() => remove(i.id)}>
                    <Trash2 size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
