import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { ShoppingCart, Check } from "lucide-react";
import { getAuthToken } from '@/config/api.ts'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAssignments, useUpdateAssignment } from '@/hooks/use.Assignments.ts'
import type { Assignment } from "@/types/api.types";

export function ProductsPage() {
  const token = getAuthToken();
  const navigate = useNavigate();
  const { assignments, refetch } = useAssignments();
  const { updateAssignment, loading: updating } = useUpdateAssignment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({ amount: 0, bought: 0 });
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleOpenModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({ amount: assignment.amount, bought: assignment.bought });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
    setFormData({ amount: 0, bought: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    try {
      await updateAssignment(
        selectedAssignment.id,
        formData.amount,
        formData.bought
      );
      await refetch();
      handleCloseModal();
    } catch (err) {
      console.error("Error updating assignment:", err);
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Productos</h2>
          <Button
            variant={showOnlyIncomplete ? "primary" : "outline"}
            onClick={() => { setShowOnlyIncomplete(!showOnlyIncomplete); }}
          >
            {showOnlyIncomplete ? "Mostrar todos" : "Solo pendientes"}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments
            .filter((p) => !showOnlyIncomplete || p.bought < p.amount)
            .map((p) => (
            <Card key={p.id} className="relative">
              {p.bought === p.amount && (
                <Check className="absolute top-3 right-3 w-5 h-5 text-green-600 dark:text-green-400" />
              )}
              <CardHeader>
                <CardTitle>{p.product_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg"> Bought: {p.bought}</p>
                    <p className="text-xs text-gray-700"> Assigned: {p.amount}</p>
                  </div>
                  <Button onClick={() => handleOpenModal(p)}>
                    <ShoppingCart size={16} /> Añadir
                  </Button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      p.bought === p.amount
                        ? "bg-green-500"
                        : "bg-indigo-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (p.bought / p.amount) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Editar: ${selectedAssignment?.product_name || ""}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cantidad Asignada
              </label>
              <Input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Cantidad Comprada: {formData.bought} / {formData.amount}
              </label>
              <input
                type="range"
                min="0"
                max={formData.amount}
                value={formData.bought}
                onChange={(e) =>
                  setFormData({ ...formData, bought: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{formData.amount}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
                disabled={updating}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={updating}>
                {updating ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
