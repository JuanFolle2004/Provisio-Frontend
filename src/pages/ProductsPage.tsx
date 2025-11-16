import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { getAuthToken } from '@/config/api.ts'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAssignments } from '@/hooks/use.Assignments.ts'

export function ProductsPage() {

  const token = getAuthToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const {assignments} = useAssignments();


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Productos</h2>
          <div className="flex gap-2">
            <Button variant="outline">Ordenar</Button>
            <Button>Importar CSV</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.product_name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg"> Bought: {p.bought}</p>
                  <p className="text-xs text-gray-700"> Assigned: {p.amount}</p>
                </div>
                <Button>
                  <ShoppingCart size={16} /> Añadir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
