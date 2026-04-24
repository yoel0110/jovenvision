import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { groupsService } from '../../services/groupsService';
import { membersService } from '../../services/membersService';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { Member } from '../../types/member';
import type { Group } from '../../types/group';

export const GroupMembers = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const groupId = Number(id);

  const [group, setGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('Seguidor');
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [groupData, membersData, allMembersData] = await Promise.all([
        groupsService.getGroupById(groupId),
        groupsService.getMembers(groupId),
        membersService.getMembers({ pageSize: 1000 }) // Fetch all to select from
      ]);
      setGroup(groupData);
      setGroupMembers(membersData);
      setAllMembers(allMembersData.data || []);
    } catch (err: any) {
      setError('Error al cargar la información del grupo');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setActionLoading(true);
    setError(null);
    try {
      await groupsService.addMember(groupId, Number(selectedMemberId), selectedRole);
      setSelectedMemberId('');
      setSelectedRole('Seguidor');
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar el miembro');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveClick = (memberId: number) => {
    setMemberToRemove(memberId);
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    setActionLoading(true);
    try {
      await groupsService.removeMember(groupId, memberToRemove);
      setMemberToRemove(null);
      await fetchData();
    } catch (err: any) {
      setError('Error al eliminar el miembro');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex-center" style={{ minHeight: '400px' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fadeIn">
      <div className="header-card">
        <div className="header-content">
          <button onClick={() => navigate('/groups')} className="btn-quick" style={{ marginBottom: '16px' }}>
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Grupos
          </button>
          <h1>Miembros de: {group?.name}</h1>
          <p>{group?.description}</p>
        </div>

        <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '16px' }}>Agregar Nuevo Miembro</h3>
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 2, minWidth: '200px' }}>
              <label className="form-label">Miembro</label>
              <select 
                className="form-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">Seleccionar Miembro...</option>
                {allMembers
                  .filter(m => !groupMembers.some(gm => gm.id === m.id))
                  .map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                  ))
                }
              </select>
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Rol</label>
              <select 
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="Seguidor">Seguidor</option>
                <option value="Lider">Líder</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={actionLoading || !selectedMemberId}>
              {actionLoading ? 'Agregando...' : 'Agregar al Grupo'}
            </button>
          </form>
          {error && <p style={{ color: '#ef4444', marginTop: '12px' }}>{error}</p>}
        </div>

        <div className="table-container" style={{ marginTop: '24px' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {groupMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '48px' }}>
                      No hay miembros en este grupo aún.
                    </td>
                  </tr>
                ) : (
                  groupMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-cell">
                          <div className="avatar">
                            {member.name.charAt(0)}
                          </div>
                          <span className="member-name">{member.name}</span>
                        </div>
                      </td>
                      <td>{member.email || 'N/A'}</td>
                      <td>
                        <span className={`badge ${member.role === 'Lider' ? 'active' : 'pending'}`}>
                          {member.role || 'Seguidor'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => handleRemoveClick(member.id)}
                          className="btn-icon delete"
                          title="Eliminar del grupo"
                          disabled={actionLoading}
                        >
                          <span className="material-symbols-outlined">person_remove</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={memberToRemove !== null}
        title="Quitar Miembro"
        description="¿Estás seguro de que deseas quitar a este miembro del grupo?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setMemberToRemove(null)}
        loading={actionLoading}
      />
    </div>
  );
};
