import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { registerWithEmail } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'

const schema = z
  .object({
    name: z.string().min(2, 'Ingresa tu nombre'),
    email: z.string().email('Ingresa un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

type FormValues = z.infer<typeof schema>

export const RegisterPage = () => {
  const navigate = useNavigate()
  const status = useAuthStore((state) => state.status)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: FormValues) =>
      registerWithEmail({ displayName: name, email, password }),
    onSuccess: () => {
      toast.success('Cuenta creada, ¡bienvenido!')
      navigate('/app')
    },
    onError: () => {
      toast.error('No pudimos crear tu cuenta, intenta nuevamente')
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
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...form.register('name')} />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input id="confirmPassword" type="password" autoComplete="new-password" {...form.register('confirmPassword')} />
        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
