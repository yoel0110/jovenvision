import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useEvents } from '../../hooks/useEvents';
import { EventTable } from '../../components/events/EventTable';
import { EventFilters } from '../../components/events/EventFilters';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import '../../styles/dashboard.css';

export const EventsIndex = () => {
  const navigate = useNavigate();
  const { 
    events, 
    loading, 
    error, 
    filters, 
    totalCount, 
    handleFilterChange, 
    handlePageChange,
    remove,
    loadingAction
  } = useEvents();

  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const handleDeleteConfirm = async () => {
    if (eventToDelete !== null) {
      const success = await remove(eventToDelete);
      if (success) {
        setEventToDelete(null);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <span className="material-symbols-outlined">event</span>
            </div>
            <div className="header-text">
              <h1>Gestión de Eventos</h1>
              <p>Planifica y administra {totalCount} eventos y actividades de la organización</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/events/create')}
            className="btn-premium"
          >
            <span className="material-symbols-outlined">calendar_add_on</span>
            <span>Nuevo Evento</span>
          </button>
        </div>

        <div className="filter-section">
          <EventFilters 
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

      <EventTable
        events={events}
        loading={loading}
        currentPage={filters.page || 1}
        pageSize={filters.pageSize || 10}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onEdit={(id) => navigate(`/events/edit/${id}`)}
        onDelete={(id) => setEventToDelete(id)}
      />

      <ConfirmModal
        isOpen={eventToDelete !== null}
        title="¿Eliminar evento?"
        description="Esta acción marcará el evento como eliminado. Se mantendrá un registro histórico pero no aparecerá en las listas operativas."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEventToDelete(null)}
        loading={loadingAction}
      />
    </div>
  );
};

export default EventsIndex;
