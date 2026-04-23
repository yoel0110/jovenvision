import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGroups } from '../../hooks/useGroups';
import { GroupTable } from '../../components/groups/GroupTable';
import { GroupFilters } from '../../components/groups/GroupFilters';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import '../../styles/dashboard.css';

export const GroupsIndex = () => {
  const navigate = useNavigate();
  const { 
    groups, 
    loading, 
    error, 
    filters, 
    totalCount, 
    handleFilterChange, 
    handlePageChange,
    remove,
    loadingAction
  } = useGroups();

  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setGroupToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      await remove(groupToDelete);
      setGroupToDelete(null);
    }
  };

  const handleEditClick = (id: number) => {
    navigate(`/groups/edit/${id}`);
  };

  const handleViewMembers = (id: number) => {
    navigate(`/groups/${id}/members`);
  };

  return (
    <div className="dashboard-container animate-fadeInUp">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div className="header-text">
              <h1>Grupos</h1>
              <p>Gestiona los grupos y ministerios de la iglesia</p>
            </div>
          </div>
          <button 
            className="btn-premium"
            onClick={() => navigate('/groups/create')}
          >
            <span className="material-symbols-outlined">add</span>
            <span>Nuevo Grupo</span>
          </button>
        </div>

        <div className="filter-section">
          <GroupFilters 
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

      <GroupTable 
        groups={groups}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onViewMembers={handleViewMembers}
        currentPage={filters.page || 1}
        totalCount={totalCount}
        pageSize={filters.pageSize || 10}
        onPageChange={handlePageChange}
      />

      <ConfirmModal
        isOpen={groupToDelete !== null}
        title="Eliminar Grupo"
        description="¿Estás seguro de que deseas eliminar este grupo? Esta acción lo desactivará en el sistema."
        onConfirm={handleConfirmDelete}
        onCancel={() => setGroupToDelete(null)}
        loading={loadingAction}
      />
    </div>
  );
};
