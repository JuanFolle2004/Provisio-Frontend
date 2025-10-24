import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import { CreditCard, Package, Tag, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const mockSpend = [
  { month: "May", spend: 320 },
  { month: "Jun", spend: 410 },
  { month: "Jul", spend: 380 },
  { month: "Ago", spend: 520 },
  { month: "Sep", spend: 480 },
  { month: "Oct", spend: 565 },
];

function KPI({ label, value, icon: Icon, trend, color }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-zinc-400">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
            <p className={`mt-1 text-xs ${color}`}>{trend}</p>
          </div>
          <div className="h-10 w-10 rounded-2xl grid place-items-center bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Icon size={18} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI label="Gasto del mes" value="$565" icon={CreditCard} trend="↑ 8% vs mes pasado" color="text-emerald-600" />
          <KPI label="Ítems comprados" value="61" icon={Package} trend="↑ 4% vs mes pasado" color="text-emerald-600" />
          <KPI label="Ahorro total" value="12%" icon={Tag} trend="↑ 12% vs mes pasado" color="text-emerald-600" />
          <KPI label="Grupos activos" value="3" icon={Users} trend="– estable" color="text-gray-400" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evolución de gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSpend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
