import React from 'react';
import type { GroupFilters as FilterType } from '../../types/group';

interface GroupFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
}

export const GroupFilters = ({ filters, onFilterChange }: GroupFiltersProps) => {
  return (
    <div className="filter-grid">
      <div className="filter-group">
        <label className="filter-label">Buscar grupo</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">search</span>
          <input
            type="text"
            placeholder="Buscar grupos por nombre..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="filter-input"
          />
        </div>
      </div>
      
      <div className="filter-group small">
        <label className="filter-label">Estado del grupo</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">filter_list</span>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
            className="filter-input"
          >
            <option value="">Cualquier estado</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => onFilterChange({ search: '', status: undefined })}
        className="btn-clear"
      >
        <span className="material-symbols-outlined">filter_alt_off</span>
        <span>Limpiar</span>
      </button>
    </div>
  );
};
