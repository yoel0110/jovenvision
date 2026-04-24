import { useState, useCallback } from 'react';
import type { User, UserPayload } from '../types/user';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err: any) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (data: UserPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.createUser(data);
      if (response.success && response.data) {
        setUsers(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: UserPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.updateUser(id, data);
      if (response.success) {
        // En lugar de hacer una petición nueva, actualizamos el estado local
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
        return true;
      } else {
        throw new Error(response.message || 'Error al actualizar usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.deleteUser(id);
      if (response.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    create,
    update,
    remove
  };
};
