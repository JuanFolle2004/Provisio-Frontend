import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Ajustes</h2>
        <Card>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Tema</span>
              <div className="flex gap-2">
                <Button variant="outline">Claro</Button>
                <Button>Oscuro</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Moneda</span>
              <div className="flex gap-2">
                <Button variant="outline">USD</Button>
                <Button>UYU</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
