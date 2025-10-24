import { DashboardLayout } from "../layouts/DashboardLayout";
import Button from "../components/ui/Button";
import { UserPlus, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <DashboardLayout>
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Compras en grupo, <span className="text-indigo-600">sin drama</span>.
          </h1>
          <p className="text-gray-600 dark:text-zinc-300 text-lg">
            Organiza listas, divide gastos y coordina con tu equipo en un solo lugar.
          </p>
          <div className="flex gap-3">
            <Button>
              <UserPlus size={16} /> Empezar gratis
            </Button>
            <Button variant="outline">
              <LayoutDashboard size={16} /> Ver demo
            </Button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
