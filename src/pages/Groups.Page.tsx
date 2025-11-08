import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Edit3, ListChecks, Users } from "lucide-react";
import { useGroups } from '@/hooks/use.Assignments.ts'
import {getAuthToken} from "@/config/api.ts";
import {useNavigate} from "react-router-dom";
import { useEffect } from 'react'

export default function GroupsPage() {

    const token = getAuthToken();
    const navigate = useNavigate();
    useEffect(() => {
      if (!token) {
        navigate('/login');
      }
    }, [token, navigate]);

  const {groups}= useGroups()
    return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Mis grupos</h2>
          <Button>
            <Users size={16} /> Crear grupo
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <Card key={g.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {g.name} <Badge>{g.role}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{g.members} miembros</p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit3 size={16} /> Editar
                  </Button>
                  <Button>
                    <ListChecks size={16} /> Ver lista
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
