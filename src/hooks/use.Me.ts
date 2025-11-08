import { useEffect, useState } from 'react'
import { usersService } from '../services/api/users.services';

import type { User, PaginatedResponse } from '../types/api.types';
import { useAuth } from '@/hooks/use.Auth.ts'
import { getAuthToken } from '@/config/api.ts'

export const useMe = () => {
  const [me, setMe] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const token = getAuthToken();

  const fetchUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await usersService.getMe()
      setMe(response.data)
    } catch (err: any) {
      setError(err.error?.message || 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser();
  },[token])


  return {me,loading, error};
};