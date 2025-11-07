import { useState, useEffect } from 'react';
import { groupsService } from '../services/api/groups.services';
import type { Group } from '../types/api.types';

export const useGroups = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);

  const createGroup = async (data: { name: string; due_date: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.createGroup(data);
      return response.data;
    } catch (err: any) {
      setError(err.error?.message || 'Failed to create group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.listGroups();
      setGroups(response.data);
    } catch (err: any) {
      setError(err.error?.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);


  return { createGroup, groups, loading, error, refresh: getGroups };
};

export const useGroup = (id: number) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.getGroup(id);
      setGroup(response.data);
    } catch (err: any) {
      setError(err.error?.message || 'Failed to fetch group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchGroup();
  }, [id]);

  return { group, loading, error, refetch: fetchGroup };
};
