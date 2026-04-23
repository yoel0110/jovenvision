import React from 'react';
import type { EventFilters as IFilters, EventType, EventStatus } from '../../types/event';

interface EventFiltersProps {
  filters: IFilters;
  onFilterChange: (filters: Partial<IFilters>) => void;
}

export const EventFilters = ({ filters, onFilterChange }: EventFiltersProps) => {
  return (
    <div className="filters-wrapper">
      <div className="filter-grid events">
        <div className="filter-group">
          <label className="filter-label">BUSCAR EVENTO</label>
          <div className="input-container">
            <span className="material-symbols-outlined icon">search</span>
            <input
              type="text"
              placeholder="Título del evento..."
              value={filters.title || ''}
              onChange={(e) => onFilterChange({ title: e.target.value })}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">TIPO</label>
          <div className="input-container">
            <span className="material-symbols-outlined icon">widgets</span>
            <select
              value={filters.type || ''}
              onChange={(e) => onFilterChange({ type: e.target.value as EventType || undefined })}
              className="filter-input"
            >
              <option value="">Todos</option>
              <option value="MEETING">Reunión</option>
              <option value="ACTIVITY">Actividad</option>
              <option value="TRAINING">Capacitación</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">ESTADO</label>
          <div className="input-container">
            <span className="material-symbols-outlined icon">radio_button_checked</span>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value as EventStatus || undefined })}
              className="filter-input"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Activo</option>
              <option value="PENDING">Pendiente</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">DESDE</label>
          <div className="input-container">
            <span className="material-symbols-outlined icon">calendar_today</span>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">HASTA</label>
          <div className="input-container">
            <span className="material-symbols-outlined icon">calendar_today</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="filter-input"
            />
          </div>
        </div>

        <button
          onClick={() => onFilterChange({ title: '', type: undefined, status: undefined, startDate: undefined, endDate: undefined })}
          className="btn-clear"
          title="Limpiar todos los filtros"
        >
          <span className="material-symbols-outlined">filter_list_off</span>
          <span>LIMPIAR</span>
        </button>
      </div>

      {/* Active Filter Chips - Heuristic: Recognition rather than recall */}
      {(filters.title || filters.type || filters.status || filters.startDate || filters.endDate) && (
        <div className="active-filters-chips animate-fadeIn">
          {filters.title && (
            <span className="filter-chip">
              Búsqueda: <strong>{filters.title}</strong>
              <button onClick={() => onFilterChange({ title: '' })}><span className="material-symbols-outlined">close</span></button>
            </span>
          )}
          {filters.type && (
            <span className="filter-chip">
              Tipo: <strong>{filters.type === 'MEETING' ? 'Reunión' : filters.type === 'ACTIVITY' ? 'Actividad' : filters.type === 'TRAINING' ? 'Capacitación' : 'Otro'}</strong>
              <button onClick={() => onFilterChange({ type: undefined })}><span className="material-symbols-outlined">close</span></button>
            </span>
          )}
          {filters.status && (
            <span className="filter-chip">
              Estado: <strong>{filters.status === 'ACTIVE' ? 'Activo' : filters.status === 'PENDING' ? 'Pendiente' : 'Cancelado'}</strong>
              <button onClick={() => onFilterChange({ status: undefined })}><span className="material-symbols-outlined">close</span></button>
            </span>
          )}
          {filters.startDate && (
            <span className="filter-chip">
              Desde: <strong>{filters.startDate}</strong>
              <button onClick={() => onFilterChange({ startDate: undefined })}><span className="material-symbols-outlined">close</span></button>
            </span>
          )}
          {filters.endDate && (
            <span className="filter-chip">
              Hasta: <strong>{filters.endDate}</strong>
              <button onClick={() => onFilterChange({ endDate: undefined })}><span className="material-symbols-outlined">close</span></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
