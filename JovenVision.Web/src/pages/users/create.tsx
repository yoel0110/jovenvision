import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUsers } from '../../hooks/useUsers';
import { useMembers } from '../../hooks/useMembers';
import { UserForm } from '../../components/users/UserForm';
import type { UserPayload } from '../../types/user';
import '../../styles/dashboard.css';

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { create, users, fetchUsers, loading: usersLoading } = useUsers();
  const { members, loading: membersLoading } = useMembers({ page: 1, pageSize: 1000, onlyWithoutUser: true });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (data: UserPayload) => {
    await create(data);
    navigate('/users');
  };

  return (
    <div className="dashboard-container">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div className="header-text">
              <h1>Nuevo Usuario</h1>
              <p>Crea un acceso vinculando a un miembro existente.</p>
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

      <div className="form-card animate-fadeInUp">
        <UserForm
          members={members}
          allUsers={users}
          onSubmit={handleSubmit}
          loading={usersLoading || membersLoading}
        />
      </div>
    </div>
  );
};

export default CreateUser;
