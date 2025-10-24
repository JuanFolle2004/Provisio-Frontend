import { DashboardLayout } from "../layouts/DashboardLayout";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <DashboardLayout>
      <div className="min-h-[50vh] grid place-items-center text-center">
        <div className="space-y-3">
          <p className="text-7xl">🤔</p>
          <h2 className="text-2xl font-bold">Página no encontrada</h2>
          <NavLink to="/">
            <Button variant="outline">Volver al inicio</Button>
          </NavLink>
        </div>
      </div>
    </DashboardLayout>
  );
}
