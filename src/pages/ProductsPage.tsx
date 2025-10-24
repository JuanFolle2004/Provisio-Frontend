import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";

const products = [
  { id: 1, name: "Yerba Canarias 1kg", price: 365, store: "Tienda Inglesa" },
  { id: 2, name: "Leche Conaprole 1L", price: 49, store: "Disco" },
  { id: 3, name: "Arroz BluePatna 5kg", price: 289, store: "Devoto" },
  { id: 4, name: "Huevos docena", price: 145, store: "Hiper" },
  { id: 5, name: "Queso Colonia 1kg", price: 699, store: "Góndola" },
];

export default function ProductsPage() {
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
          {products.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">$ {p.price}</p>
                  <p className="text-xs text-gray-500">{p.store}</p>
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
