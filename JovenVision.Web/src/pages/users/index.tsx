import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useUsers } from '../../hooks/useUsers';
import { useMembers } from '../../hooks/useMembers';
import { UserTable } from '../../components/users/UserTable';
import { UserFilters } from '../../components/users/UserFilters';
import type { User } from '../../types/user';
import '../../styles/dashboard.css';

export const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers, update } = useUsers();
  const { members } = useMembers();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter ? user.roleId.toString() === roleFilter : true;
      const matchStatus = statusFilter ? user.active.toString() === statusFilter : true;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: User) => {
    if (window.confirm(`¿Estás seguro de ${user.active ? 'desactivar' : 'activar'} al usuario ${user.username}?`)) {
      try {
        await update(user.id, {
          username: user.username,
          roleId: user.roleId,
          memberId: user.memberId || 0,
          active: !user.active,
          password: ''
        });
      } catch (err) {
        console.error('Error al cambiar estado:', err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div className="header-text">
              <h1>Gestión de Usuarios</h1>
              <p>Administra los accesos al sistema y sus roles.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/users/new')}
            className="btn-premium"
          >
            <span className="material-symbols-outlined">person_add</span>
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <div className="filter-section">
          <UserFilters
            onSearch={setSearchTerm}
            onRoleFilter={setRoleFilter}
            onStatusFilter={setStatusFilter}
          />
        </div>
      </div>

      {error && !loading && (
        <div className="error-banner animate-fadeInUp">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
          <button onClick={fetchUsers} className="btn-clear">
            <span className="material-symbols-outlined">refresh</span>
            <span>Reintentar</span>
          </button>
        </div>
      )}

      <UserTable
        users={filteredUsers}
        members={members}
        loading={loading}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default UsersList;
