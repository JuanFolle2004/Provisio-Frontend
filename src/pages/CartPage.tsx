import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";

const items = [
  { id: 1, name: "Yerba Canarias 1kg", qty: 1, price: 365 },
  { id: 2, name: "Leche Conaprole 1L", qty: 6, price: 49 },
];

export default function CartPage() {
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Carrito</h2>
        <Card>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
              {items.map((i) => (
                <li key={i.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      x{i.qty} • $ {i.price} c/u
                    </p>
                  </div>
                  <span className="font-semibold">$ {i.qty * i.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-gray-500 dark:text-zinc-400">Total</span>
              <span className="text-xl font-bold">$ {total}</span>
            </div>
            <div className="pt-4 flex gap-2">
              <Button variant="outline">Dividir gasto</Button>
              <Button>Pagar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
