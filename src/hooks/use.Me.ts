import { useState } from 'react'
import { usersService } from '../services/api/users.services';

import type { User } from '../types/api.types';

export const useMe = () => {
  const [me, setMe] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMe = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await usersService.getMe()
      setMe(response.data)
    } catch (err: any) {
      setError(err.error?.message ?? 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  return {me,loading, error,fetchMe};
};