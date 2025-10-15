import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { toast } from 'sonner'

import { loginWithEmail } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type FormValues = z.infer<typeof schema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const status = useAuthStore((state) => state.status)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: loginWithEmail,
    onSuccess: () => {
      toast.success('¡Bienvenido de nuevo!')
      const redirectTo = (location.state as { from?: string } | undefined)?.from ?? '/app'
      navigate(redirectTo, { replace: true })
    },
    onError: () => {
      toast.error('No pudimos iniciar sesión. Revisa tus credenciales.')
    },
  })

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/app', { replace: true })
    }
  }, [status, navigate])

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" {...form.register('password')} />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Ingresando…' : 'Ingresar'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-primary">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
