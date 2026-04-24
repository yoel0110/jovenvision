import React from 'react';
import type { User } from '../../types/user';
import type { Member } from '../../types';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface UserTableProps {
  users: User[];
  members: Member[];
  loading: boolean;
  onToggleStatus: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, members, loading, onToggleStatus }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const getMemberName = (user: User) => {
    if (user.memberName) return user.memberName;
    if (!user.memberId) return 'N/A';
    const member = members.find(m => m.id === user.memberId);
    return member ? member.name : 'Miembro Desconocido';
  };

  const getRoleName = (roleId: number) => {
    switch(roleId) {
      case 1: return 'Administrador';
      case 2: return 'Líder';
      case 3: return 'Usuario Estandar';
      default: return 'Desconocido';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="empty-state">
        <div className="loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: '#64748b', fontWeight: '500' }}>Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state animate-fadeInUp">
        <div className="empty-icon">
          <span className="material-symbols-outlined">manage_accounts</span>
        </div>
        <h3>No se encontraron usuarios</h3>
        <p>No hay usuarios registrados en el sistema actualmente.</p>
      </div>
    );
  }

  return (
    <div className="table-container animate-fadeInUp">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Miembro Vinculado</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="member-cell">
                    <div className="avatar">
                      <span className="material-symbols-outlined" style={{color: 'white', fontSize: '18px'}}>person</span>
                    </div>
                    <div>
                      <div className="member-name">{user.username}</div>
                      <div className="member-id">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '500' }}>
                    {getMemberName(user)}
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                    {getRoleName(user.roleId)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {currentUser?.id === user.id ? (
                    <span
                      className="badge"
                      style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '0.65rem' }}
                      title="No puedes editar tu propia cuenta"
                    >
                      Tu cuenta
                    </span>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                        className="btn-icon"
                        title="Editar"
                        disabled={loading}
                      >
                        <span className="material-symbols-outlined">edit_square</span>
                      </button>
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`btn-icon ${user.active ? 'delete' : ''}`}
                        title={user.active ? 'Desactivar' : 'Activar'}
                        disabled={loading}
                      >
                        <span className="material-symbols-outlined">
                          {user.active ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
