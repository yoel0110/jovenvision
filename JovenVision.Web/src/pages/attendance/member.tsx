import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { membersService } from '../../services/membersService';
import type { Member } from '../../types/member';
import '../../styles/components/attendance.css';

export const MemberAttendanceHistory = () => {
  const { attendanceList, fetchByMember, loading, error } = useAttendance();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await membersService.getMembers({ pageSize: 100 });
        setMembers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchByMember(selectedMemberId);
    }
  }, [selectedMemberId, fetchByMember]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <div className="header-icon attendance">
            <span className="material-symbols-outlined">person_search</span>
          </div>
          <div>
            <h1>Historial por Miembro</h1>
            <p>Consulta la participación individual a lo largo del tiempo.</p>
          </div>
        </div>
      </div>

      <div className="member-history-grid">
        <div className="member-selector-panel card">
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="Buscar miembro..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="members-list">
            {filteredMembers.map(m => (
              <div 
                key={m.id} 
                className={`member-option ${selectedMemberId === m.id ? 'active' : ''}`}
                onClick={() => setSelectedMemberId(m.id)}
              >
                <div className="avatar-small">{m.name[0]}</div>
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="history-content">
          {selectedMember ? (
            <div className="history-card card animate-slideIn">
              <div className="history-header">
                <div className="member-info-large">
                  <div className="avatar-large">{selectedMember.name[0]}</div>
                  <div>
                    <h2>{selectedMember.name}</h2>
                    <span className="member-id">ID: {selectedMember.id}</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">Cargando historial...</div>
              ) : error ? (
                <div className="error-msg">{error}</div>
              ) : (
                <div className="timeline">
                  {attendanceList.length > 0 ? (
                    attendanceList.map(item => (
                      <div key={item.id} className="timeline-item">
                        <div className={`status-indicator ${item.status.toLowerCase()}`}></div>
                        <div className="event-details">
                          <span className="date">{new Date(item.registeredAt).toLocaleDateString()}</span>
                          <span className="event-title">{item.event?.title || 'Evento Desconocido'}</span>
                          <span className={`status-badge ${item.status.toLowerCase()}`}>
                            {item.status === 'Present' ? 'Presente' : item.status === 'Absent' ? 'Ausente' : 'Justificado'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-history">Este miembro no tiene registros de asistencia aún.</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-selection card">
              <span className="material-symbols-outlined">person_outline</span>
              <p>Selecciona un miembro de la lista para ver su historial.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
