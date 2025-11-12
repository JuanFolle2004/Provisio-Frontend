import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Edit3, ListChecks, Users, X } from "lucide-react";
import { useGroups } from '@/hooks/use.Assignments.ts'
import { getAuthToken } from "@/config/api.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function GroupsPage() {
  const token = getAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const { groups, createGroup } = useGroups();

  const handleCreate = async () => {
    if (!groupName || !eventDate) return alert("Completa todos los campos");
    try {
      await createGroup({name:groupName, due_date:eventDate});
      setCreateOpen(false);
      setGroupName("");
      setEventDate("");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Error al crear el grupo");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Mis grupos</h2>
          <Button onClick={() => setCreateOpen(true)}>
            <Users size={16} /> Crear grupo
          </Button>
        </div>

        {/* Modal simple */}
        {createOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setCreateOpen(false)}
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold mb-4">Crear nuevo grupo</h3>

              <label className="block mb-2 text-sm font-medium text-black">
                Nombre del grupo
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border rounded p-2 mb-3 text-sm text-black"
                placeholder="Ej: Grupo A"
              />

              <label className="block mb-2 text-sm font-medium text-black">
                Fecha del evento
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border rounded p-2 mb-4 text-sm text-black"
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>Crear</Button>
              </div>
            </div>
          </div>
        )}

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
                  <Button onClick={() => navigate(`/list/${g.id}`)}>
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
