import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Edit3 } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Perfil</h2>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-12 w-12 rounded-full bg-indigo-600 text-white grid place-items-center font-bold">
              F
            </div>
            <div className="flex-1">
              <p className="font-semibold">Federica</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">fede@example.com</p>
            </div>
            <Button variant="outline">
              <Edit3 size={16} /> Editar
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
