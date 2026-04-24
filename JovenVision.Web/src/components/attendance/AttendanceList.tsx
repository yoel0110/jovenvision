import React, { useState } from 'react';
import { AttendanceItem } from './AttendanceItem';
import type { Member } from '../../types/member';
import type { Attendance, AttendanceStatus } from '../../types/attendance';
import '../../styles/components/attendance.css';

interface AttendanceListProps {
  members: Member[];
  attendanceRecords: Attendance[];
  onMark: (memberId: number, status: AttendanceStatus) => void;
  loading?: boolean;
}

export const AttendanceList = ({ members, attendanceRecords, onMark, loading }: AttendanceListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberStatus = (memberId: number) => {
    return attendanceRecords.find(a => a.memberId === memberId)?.status;
  };

  const summary = {
    total: members.length,
    present: members.filter(a => a.name === 'Present').length,
    absent: members.filter(a => a.name === 'Absent').length,
    justified: members.filter(a => a.name === 'Justified').length,
  };

  if (loading && members.length === 0) {
    return (
      <div className="attendance-skeleton">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-item"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="attendance-list-container">
      <div className="attendance-summary">
        <div className="summary-card total">
          <span className="label">Total</span>
          <span className="value">{summary.total}</span>
        </div>
        <div className="summary-card present">
          <span className="label">Presentes</span>
          <span className="value">{summary.present}</span>
        </div>
        <div className="summary-card absent">
          <span className="label">Ausentes</span>
          <span className="value">{summary.absent}</span>
        </div>
        <div className="summary-card justified">
          <span className="label">Justificados</span>
          <span className="value">{summary.justified}</span>
        </div>
      </div>

      <div className="list-header-actions">
        <div className="list-header">
          <h3>Lista de Miembros</h3>
          <span className="count">{filteredMembers.length} de {members.length} miembros</span>
        </div>
        
        <div className="search-filter-container">
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Buscar miembro por nombre..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="items-grid">
        {filteredMembers.map(member => (
          <AttendanceItem
            key={member.id}
            member={member}
            status={getMemberStatus(member.id)}
            onStatusChange={(status) => onMark(member.id, status)}
            loading={loading}
          />
        ))}
      </div>
      
      {members.length === 0 && (
        <div className="empty-state">
          <span className="material-symbols-outlined">group_off</span>
          <p>No hay miembros disponibles para este evento.</p>
        </div>
      )}
    </div>
  );
};
