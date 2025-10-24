import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  // 👇 Tipo explícito para el submit del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // registro simulado
    if (email && pass) navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="min-h-[60vh] grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Crear cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* 👇 Tipado explícito para eventos onChange */}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={pass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPass(e.target.value)
                }
                required
              />
              <Button className="w-full" type="submit">
                Registrarme
              </Button>
              <div className="text-center text-xs text-gray-500 dark:text-zinc-400">
                ¿Ya tenés cuenta?{" "}
                <NavLink className="text-indigo-600" to="/login">
                  Ingresar
                </NavLink>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
