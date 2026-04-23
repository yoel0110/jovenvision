import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMembers } from '../../hooks/useMembers';
import { MemberTable } from '../../components/members/MemberTable';
import { MemberFilters } from '../../components/members/MemberFilters';
import '../../styles/dashboard.css';

export const MembersIndex = () => {
  const navigate = useNavigate();
  const { 
    members, 
    loading, 
    error, 
    filters, 
    totalCount, 
    handleFilterChange, 
    handlePageChange,
    remove 
  } = useMembers();

  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const handleDeleteConfirm = async () => {
    if (memberToDelete !== null) {
      const success = await remove(memberToDelete);
      if (success) {
        setMemberToDelete(null);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div className="header-text">
              <h1>Gestión de Miembros</h1>
              <p>Administra y organiza la base de datos de tu ministerio</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/members/create')}
            className="btn-premium"
          >
            <span className="material-symbols-outlined">person_add</span>
            <span>Nuevo Miembro</span>
          </button>
        </div>

        <div className="filter-section">
          <MemberFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      </div>

      {error && !loading && (
        <div className="error-banner animate-fadeInUp">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}

      <MemberTable
        members={members}
        loading={loading}
        currentPage={filters.page || 1}
        pageSize={filters.pageSize || 10}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onEdit={(id) => navigate(`/members/edit/${id}`)}
        onDelete={(id) => setMemberToDelete(id)}
      />

      {/* Delete Confirmation Modal */}
      {memberToDelete !== null && (
        <div className="modal-overlay animate-fadeIn">
          <div className="modal-content animate-scaleUp">
            <div className="modal-icon-container delete">
              <span className="material-symbols-outlined">delete_forever</span>
            </div>
            <h3 className="modal-title">¿Eliminar miembro?</h3>
            <p className="modal-description">
              Esta acción desactivará al miembro de la plataforma. Podrás reactivarlo más tarde si es necesario.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setMemberToDelete(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn-danger"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersIndex;
