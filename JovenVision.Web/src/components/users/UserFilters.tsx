import React from 'react';

interface UserFiltersProps {
  onSearch: (term: string) => void;
  onRoleFilter: (roleId: string) => void;
  onStatusFilter: (status: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  onSearch,
  onRoleFilter,
  onStatusFilter
}) => {
  return (
    <div className="filter-grid">
      <div className="filter-group">
        <label className="filter-label">Buscar usuario</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">search</span>
          <input
            type="text"
            placeholder="Buscar por usuario..."
            onChange={(e) => onSearch(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-group small">
        <label className="filter-label">Rol</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">manage_accounts</span>
          <select 
            className="filter-input"
            onChange={(e) => onRoleFilter(e.target.value)}
          >
            <option value="">Todos los Roles</option>
            <option value="1">Administrador</option>
            <option value="2">Líder</option>
            <option value="3">Usuario Estandar</option>
          </select>
        </div>
      </div>

      <div className="filter-group small">
        <label className="filter-label">Estado</label>
        <div className="input-container">
          <span className="material-symbols-outlined icon">filter_list</span>
          <select 
            className="filter-input"
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            <option value="">Cualquier Estado</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>
    </div>
  );
};
