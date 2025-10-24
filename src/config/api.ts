export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('auth_token');