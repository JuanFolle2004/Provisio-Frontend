import { useState } from 'react';
import { usersService } from '../services/api/users.services';
import { setAuthToken, removeAuthToken } from '../config/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (data: {
    name: string;
    email_address: string;
    password: string;
    password_confirmation: string;
    username: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.signUp(data);
      return response.data;
    } catch (err: any) {
      setError(err.error?.message || 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.login({ email, password });
      setAuthToken(response.data.access_token);
      return response.data;
    } catch (err: any) {
      setError(err.error?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
  };

  return { signUp, login, logout, loading, error };
};