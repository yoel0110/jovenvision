import React from 'react';
import type { JovenEvent } from '../../types/event';

interface EventTableProps {
  events: JovenEvent[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const EventTable = ({
  events,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalCount,
  pageSize,
  onPageChange
}: EventTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'PENDING': return 'Pendiente';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MEETING': return 'Reunión';
      case 'ACTIVITY': return 'Actividad';
      case 'TRAINING': return 'Capacitación';
      case 'OTHER': return 'Otro';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (loading && events.length === 0) {
    return (
      <div className="table-container animate-fadeIn">
        <div className="table-wrapper">
          <table className="skeleton-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Grupo</th>
                <th>Tipo</th>
                <th>Fecha y Hora</th>
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td><div className="skeleton-line" style={{ width: '150px' }}></div></td>
                  <td><div className="skeleton-line" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-line" style={{ width: '80px' }}></div></td>
                  <td><div className="skeleton-line" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-line" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-line" style={{ width: '40px' }}></div></td>
                  <td><div className="skeleton-line" style={{ width: '60px' }}></div></td>
                  <td style={{ textAlign: 'right' }}><div className="skeleton-line" style={{ width: '60px', marginLeft: 'auto' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="empty-state animate-fadeInUp">
        <div className="empty-icon" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
          <span className="material-symbols-outlined">event_busy</span>
        </div>
        <h3 style={{ color: '#0f172a', fontWeight: '800' }}>No se encontraron eventos</h3>
        <p style={{ color: '#64748b', maxWidth: '300px', margin: '0 auto' }}>
          No hay eventos que coincidan con los filtros seleccionados.
        </p>
        <button 
          onClick={() => onPageChange(1)} 
          className="btn-secondary" 
          style={{ marginTop: '20px', width: 'auto', padding: '10px 20px' }}
        >
          Ver todos los eventos
        </button>
      </div>
    );
  }

  return (
    <div className="table-container animate-fadeInUp">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Grupo</th>
              <th>Tipo</th>
              <th>Fecha y Hora</th>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="member-cell">
                    <div className={`avatar ${isPastEvent(event.date) ? 'past' : ''}`}>
                      <span className="material-symbols-outlined">
                        {event.type === 'MEETING' ? 'groups' : 
                         event.type === 'TRAINING' ? 'school' : 
                         event.type === 'ACTIVITY' ? 'celebration' : 'event'}
                      </span>
                    </div>
                    <div>
                      <div className="member-name">{event.title}</div>
                      <div className="member-id">ID: {event.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '6px', color: '#64748b' }}>
                      {event.group ? 'group' : 'public'}
                    </span>
                    <span style={{ fontWeight: '500', color: event.group ? '#1e293b' : '#94a3b8' }}>
                      {event.group ? event.group.name : 'Público'}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="text-sm font-medium">{getTypeLabel(event.type)}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formatDate(event.date)}</span>
                    {isPastEvent(event.date) && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Finalizado</span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px', color: '#94a3b8' }}>location_on</span>
                    {event.location || '—'}
                  </div>
                </td>
                <td>
                  <div className="capacity-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>group</span>
                    {event.capacity}
                  </div>
                </td>
                <td>
                  <span className={`badge ${event.status.toLowerCase()}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button
                      onClick={() => onEdit(event.id)}
                      className="btn-icon"
                      title="Editar"
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined">edit_square</span>
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="btn-icon delete"
                      title="Eliminar"
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Total: <span>{totalCount}</span> eventos
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-page"
            >
              <span className="material-symbols-outlined">chevron_left</span>
              Anterior
            </button>
            <div className="page-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-page"
            >
              Siguiente
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
