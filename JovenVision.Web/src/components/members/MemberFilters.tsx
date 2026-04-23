import React from 'react';
import type { MemberFilters as IFilters, MemberStatus } from '../../types/member';

interface MemberFiltersProps {
  filters: IFilters;
  onFilterChange: (filters: Partial<IFilters>) => void;
}

export const MemberFilters = ({ filters, onFilterChange }: MemberFiltersProps) => {
  return (
    <div className="filter-grid">
      <div className="filter-group">
        <label className="filter-label">Buscar integrante</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">search</span>
          <input
            type="text"
            placeholder="Nombre, apellido o correo..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-group small">
        <label className="filter-label">Estado del registro</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">filter_list</span>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value as MemberStatus || undefined })}
            className="filter-input"
          >
            <option value="">Cualquier estado</option>
            <option value="Active">Activos</option>
            <option value="Inactive">Inactivos</option>
            <option value="Pending">Pendientes</option>
            <option value="Banned">Baneados</option>
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
