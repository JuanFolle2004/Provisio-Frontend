import { useEffect, useState } from 'react'
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Plus, Trash2 } from "lucide-react";
import { getAuthToken } from '@/config/api.ts'
import { useNavigate , useParams } from 'react-router-dom'
import {useProducts} from "@/hooks/use.Products.ts";
import type {Product} from "@/types/api.types.ts";

interface Item {
  id: number;
  name: string;
  qty: number;
  done: boolean;
}

export default function ListsPage() {

  const { id } = useParams(); // <-- id del grupo desde la URL
  const token = getAuthToken();
  const navigate = useNavigate();

  const { products, createProducts } = useProducts({groupId:id})

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);


  const [newItems, setNewItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(1);

  const addItem = () => {
    if (!name.trim()) return;
    if(allProducts.filter((i) => i.name == name).length > 0) {
        // toaster o algo
        return
    }
    setNewItems((prev) => [{name, amount, done: false }, ...prev]);
    setName("");
    setAmount(1);
  };

  const handleSubmit = async () => {
      await createProducts(newItems)
      setNewItems([]);
  }
  const allProducts = [
      ...products,
      ...newItems,
  ]

  const remove = (name: string) => setNewItems((prev) => prev.filter((i) => i.name !== name));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agregar producto</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Producto..."
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); }}
            />
            <Input
              type="number"
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                { setAmount(Number(e.target.value) || 1); }
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
              {allProducts.map((product) => (
                <li key={product.id ?? product.name} className="flex items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => { console.log(product.id ?? product.name); }}
                    className="size-4 accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${false ? "line-through opacity-60" : ""}`}>
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">x{product.amount}</p>
                  </div>
                  <Button variant="ghost" onClick={() => { remove(product.name); }}>
                    <Trash2 size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

          <div className={'w-full flex justify-around '}>
              <Button onClick={handleSubmit} type="submit">
              Save
              </Button>
          </div>
      </div>
    </DashboardLayout>
  );
}
