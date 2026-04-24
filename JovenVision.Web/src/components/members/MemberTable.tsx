import type { Member } from '../../types/member';

interface MemberTableProps {
  members: Member[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onFollowup: (id: number) => void;
}

export const MemberTable = ({
  members,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onFollowup
}: MemberTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);


  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Active': return 'Activo';
      case 'Inactive': return 'Inactivo';
      case 'Pending': return 'Pendiente';
      case 'Banned': return 'Baneado';
      default: return status;
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="empty-state">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Cargando miembros...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="empty-state animate-fadeInUp">
        <div className="empty-icon">
          <span className="material-symbols-outlined">person_search</span>
        </div>
        <h3>No se encontraron miembros</h3>
        <p>
          Parece que no hay registros que coincidan con tu búsqueda. 
          Prueba ajustando los filtros o añade un nuevo integrante para comenzar.
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
              <th>Integrante</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Registro</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="member-cell">
                    <div className="avatar">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="member-name">{member.name}</div>
                      <div className="member-id">ID: {member.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '8px', color: '#94a3b8' }}>mail</span>
                      {member.email || '—'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', marginRight: '8px' }}>phone</span>
                      {member.phone || '—'}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${member.status.toLowerCase()}`}>
                    {getStatusLabel(member.status)}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
                    {member.createdAt ? (
                      new Intl.DateTimeFormat('es-ES', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      }).format(new Date(member.createdAt.toString().replace(' ', 'T')))
                    ) : '—'}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button
                      onClick={() => onFollowup(member.id)}
                      className="btn-icon"
                      title="Seguimiento"
                      style={{ color: '#2563eb' }}
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined">track_changes</span>
                    </button>
                    <button
                      onClick={() => onEdit(member.id)}
                      className="btn-icon"
                      title="Editar"
                      disabled={loading}
                    >
                      <span className="material-symbols-outlined">edit_square</span>
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
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
            Total: <span>{totalCount}</span> miembros
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
