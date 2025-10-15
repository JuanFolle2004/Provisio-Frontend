import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MemberInviteProps {
  onInvite: (username: string) => Promise<void>
}

export const MemberInvite = ({ onInvite }: MemberInviteProps) => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!username.trim()) return

    try {
      setIsLoading(true)
      await onInvite(username.trim())
      setUsername('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Usuario de Provisio"
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando…' : 'Invitar'}
      </Button>
    </form>
  )
}
