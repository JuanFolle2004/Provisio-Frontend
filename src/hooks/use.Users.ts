import { useState, useEffect } from 'react';
import { usersService } from '../services/api/users.services';

import type { User, PaginatedResponse } from '../types/api.types';

export const useUsers = (params?: { page?: number; filter?: string; sort?: string }) => {
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getUsers(params);
      setUsers(data);
    } catch (err: any) {
      setError(err.error?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params?.page, params?.filter, params?.sort]);

  return { users, loading, error, refetch: fetchUsers };
};

export const useUser = (id: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.getUser(id);
      setUser(response.data);
    } catch (err: any) {
      setError(err.error?.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const updateUser = async (data: {
    name: string;
    email_address: string;
    password: string;
    password_confirmation: string;
    username: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.updateUser(id, data);
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.error?.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await usersService.deleteUser(id);
    } catch (err: any) {
      setError(err.error?.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, updateUser, deleteUser, refetch: fetchUser };
};