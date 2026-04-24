import type { Group } from '../../types/group';

interface GroupTableProps {
  groups: Group[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewMembers: (id: number) => void;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const GroupTable = ({
  groups = [],
  loading,
  onEdit,
  onDelete,
  onViewMembers,
  currentPage,
  totalCount,
  pageSize,
  onPageChange
}: GroupTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      default: return status || 'Desconocido';
    }
  };

  if (loading && groups.length === 0) {
    return (
      <div className="empty-state">
        <div className="loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: '#64748b', fontWeight: '500' }}>Cargando grupos...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="empty-state animate-fadeInUp">
        <div className="empty-icon">
          <span className="material-symbols-outlined">group_off</span>
        </div>
        <h3>No se encontraron grupos</h3>
        <p>
          Parece que no hay registros que coincidan con tu búsqueda. 
          Prueba ajustando los filtros o crea un nuevo grupo para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container animate-fadeInUp">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Creación</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>
                  <div className="member-cell">
                    <div className="avatar">
                      <span className="material-symbols-outlined" style={{color: 'white', fontSize: '18px'}}>groups</span>
                    </div>
                    <div>
                      <div className="member-name">{group.name}</div>
                      <div className="member-id">ID: {group.id} | Capacidad: {group.capacity}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {group.description || 'Sin descripción'}
                  </div>
                </td>
                <td>
                  <span className={`badge ${(group.status || 'UNKNOWN').toLowerCase()}`}>
                    {getStatusLabel(group.status)}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {group.createdAt 
                      ? new Date(group.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) 
                      : 'No disponible'}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button
                      onClick={() => onEdit(group.id)}
                      className="btn-icon"
                      title="Editar"
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined">edit_square</span>
                    </button>
                    <button
                      onClick={() => onViewMembers(group.id)}
                      className="btn-icon"
                      title="Gestionar Miembros"
                      disabled={loading}
                      style={{ color: 'var(--primary)' }}
                    >
                      <span className="material-symbols-outlined">group</span>
                    </button>
                    <button
                      onClick={() => onDelete(group.id)}
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

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Total: <span>{totalCount}</span> grupos
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
