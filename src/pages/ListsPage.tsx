import { useEffect, useState } from 'react'
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Plus, Trash2 } from "lucide-react";
import { getAuthToken } from '@/config/api.ts'
import { useNavigate , useParams } from 'react-router-dom'
import {useProducts} from "@/hooks/use.Products.ts";
import { useAssignProduct } from "@/hooks/use.Assignments.ts";
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
  const { assignProduct, loading: assigning } = useAssignProduct();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);


  const [newItems, setNewItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [assignFormData, setAssignFormData] = useState({ amount: 1, bought: 0 });

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

  const handleOpenModal = (product: Product) => {
    console.log('Opening modal for product:', product);
    if (!product.id || product.id <= 0) {
      console.log('Product has no valid ID, modal wont open');
      return; // Solo productos guardados
    }
    setSelectedProduct(product);
    setAssignFormData({ amount: 0, bought: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setAssignFormData({ amount: 1, bought: 0 });
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct?.id || !id) return;

    try {
      await assignProduct(
        selectedProduct.id,
        Number(id),
        assignFormData.amount,
        assignFormData.bought
      );
      handleCloseModal();
      // Opcionalmente refrescar la lista
    } catch (err) {
      console.error("Error assigning product:", err);
    }
  };

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
                  <Button
                    variant="outline"
                    onClick={() => handleOpenModal(product)}
                    disabled={!product.id}
                    className="text-sm"
                  >
                    Asignarme
                  </Button>
                  <div className="flex-1">
                    <p className="font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">x{product.amount} {product.assigned ? `(${product.assigned} asignados)` : ''}</p>
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

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Asignarme: ${selectedProduct?.name || ""}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cantidad a asignar
              </label>
              <Input
                type="number"
                min="1"
                max={selectedProduct?.amount}
                value={assignFormData.amount || ''}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setAssignFormData({ ...assignFormData, amount: Number(e.target.value) })
                }
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Cantidad ya comprada: {assignFormData.bought} / {assignFormData.amount}
              </label>
              <input
                type="range"
                min="0"
                max={assignFormData.amount}
                value={assignFormData.bought}
                onChange={(e) =>
                  setAssignFormData({ ...assignFormData, bought: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{assignFormData.amount}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
                disabled={assigning}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={assigning}>
                {assigning ? "Asignando..." : "Asignarme"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
