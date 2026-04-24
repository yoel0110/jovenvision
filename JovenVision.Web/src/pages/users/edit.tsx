import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUsers } from '../../hooks/useUsers';
import { useMembers } from '../../hooks/useMembers';
import { userService } from '../../services/userService';
import { UserForm } from '../../components/users/UserForm';
import type { User, UserPayload } from '../../types/user';
import '../../styles/dashboard.css';

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, fetchUsers, update, loading: usersLoading } = useUsers();
  const { members, loading: membersLoading, handleFilterChange } = useMembers({ page: 1, pageSize: 1000, onlyWithoutUser: true });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (currentUser?.memberId) {
      handleFilterChange({ includeMemberId: currentUser.memberId });
    }
  }, [currentUser?.memberId, handleFilterChange]);

  useEffect(() => {
    const loadUser = async () => {
      if (id) {
        try {
          const res = await userService.getUserById(parseInt(id));
          if (res.success && res.data) {
            setCurrentUser(res.data);
          }
        } catch (err) {
          console.error('Error cargando usuario:', err);
        } finally {
          setFetchingUser(false);
        }
      }
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (data: UserPayload) => {
    if (id) {
      await update(parseInt(id), data);
      navigate('/users');
    }
  };

  if (fetchingUser) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon animate-spin">progress_activity</span>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon" style={{ color: 'var(--error)' }}>error</span>
          <h3>Usuario no encontrado</h3>
          <button className="btn-premium" onClick={() => navigate('/users')} style={{ marginTop: '16px' }}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <span className="material-symbols-outlined">edit_square</span>
            </div>
            <div className="header-text">
              <h1>Editar Usuario</h1>
              <p>Modifica los accesos de <strong>{currentUser.username}</strong>.</p>
            </div>
          </div>

          <button
            className="btn-clear"
            onClick={() => navigate('/users')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver</span>
          </button>
        </div>
      </div>

      <div className="error-banner animate-fadeInUp" style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
        <span className="material-symbols-outlined" style={{ color: '#d97706' }}>warning</span>
        <p>Para guardar los cambios, debes ingresar una nueva contraseña (mínimo 8 caracteres).</p>
      </div>

      <div className="form-card animate-fadeInUp">
        <UserForm
          initialData={currentUser}
          members={members}
          allUsers={users}
          onSubmit={handleSubmit}
          loading={usersLoading || membersLoading}
        />
      </div>
    </div>
  );
};

export default EditUser;
