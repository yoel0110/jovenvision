import type { Member } from '../../types/member';
import type { AttendanceStatus } from '../../types/attendance';
import '../../styles/components/attendance.css';

interface AttendanceItemProps {
  member: Member;
  status?: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
  loading?: boolean;
}

export const AttendanceItem = ({ member, status, onStatusChange, loading }: AttendanceItemProps) => {
  return (
    <div className={`attendance-item ${status ? status.toLowerCase() : 'pending'} animate-fadeIn`}>
      <div className="member-info">
        <div className="avatar-container">
          <div className="avatar">
            {getInitials(member.name)}
          </div>
          <div className={`status-dot ${status ? status.toLowerCase() : 'pending'}`}></div>
        </div>
        <div className="details">
          <span className="name">{member.name}</span>
          <div className="status-container">
            <span className="status-label">{status ? getLabel(status) : 'Pendiente'}</span>
          </div>
        </div>
      </div>
      
      <div className="actions">
        <button 
          className={`action-btn present ${status === 'Present' ? 'active' : ''}`}
          onClick={() => onStatusChange('Present')}
          disabled={loading}
          title="Presente"
        >
          <span className="material-symbols-outlined">done</span>
        </button>
        <button 
          className={`action-btn absent ${status === 'Absent' ? 'active' : ''}`}
          onClick={() => onStatusChange('Absent')}
          disabled={loading}
          title="Ausente"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <button 
          className={`action-btn justified ${status === 'Justified' ? 'active' : ''}`}
          onClick={() => onStatusChange('Justified')}
          disabled={loading}
          title="Justificado"
        >
          <span className="material-symbols-outlined">edit_note</span>
        </button>
      </div>
    </div>
  );
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getLabel = (status: AttendanceStatus) => {
  switch (status) {
    case 'Present': return 'Presente';
    case 'Absent': return 'Ausente';
    case 'Justified': return 'Justificado';
    default: return 'Pendiente';
  }
};
