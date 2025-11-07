import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { type SignUpParams, useAuth } from '@/hooks/use.Auth.ts'

export default function RegisterPage() {
  const [params, setParams] = useState<SignUpParams>({
    email_address: '',
    name: '',
    password: '',
    password_confirmation: '',
    username: '',
  });

  const navigate = useNavigate();
  const {signUp} = useAuth();

  // 👇 Tipo explícito para el submit del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // registro simulado
    await signUp(params).then(() => {
      navigate('/dashboard')
    })
  }

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
                type="name"
                placeholder="Name"
                value={params.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                  setParams({...params,name:e.target.value});
                }}
                required
              />
              <Input
                type="username"
                placeholder="Username"
                value={params.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                  setParams({...params,username:e.target.value});
                }}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={params.email_address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                  setParams({...params,email_address:e.target.value});
                }}
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={params.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                  setParams({...params,password:e.target.value, password_confirmation:e.target.value});

                }}
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
