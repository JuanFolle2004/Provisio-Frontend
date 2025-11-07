import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from '@/hooks/use.Auth.ts'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const {login} = useAuth();
  // 👇 tipo explícito para el evento del form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   console.log("LOGinn");
    e.preventDefault();
    await login(email, pass).then(() => { navigate('/dashboard'); })
  }

  return (
    <DashboardLayout>
      <div className="min-h-[60vh] grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Ingresar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  { setEmail(e.target.value); }
                }
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={pass}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  { setPass(e.target.value); }
                }
                required
              />
              <Button className="w-full" type="submit">
                Entrar
              </Button>
              <div className="text-center text-xs text-gray-500 dark:text-zinc-400">
                ¿No tenés cuenta?{" "}
                <NavLink className="text-indigo-600" to="/register">
                  Crear una
                </NavLink>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
