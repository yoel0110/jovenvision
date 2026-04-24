import React from 'react';
import type { FollowUp } from '../../types';

interface FollowupItemProps {
  followup: FollowUp;
  onComplete?: (id: number) => void;
}

const FollowupItem: React.FC<FollowupItemProps> = ({ followup, onComplete }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return new Intl.DateTimeFormat('es-DO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getIcon = () => {
    switch (followup.type) {
      case 'CALL': return 'call';
      case 'MESSAGE': return 'chat';
      case 'VISIT': return 'home';
      default: return 'info';
    }
  };

  const getBadgeClass = () => {
    switch (followup.type) {
      case 'CALL': return 'badge-call';
      case 'MESSAGE': return 'badge-message';
      case 'VISIT': return 'badge-visit';
      default: return 'badge-other';
    }
  };

  const getTypeLabel = () => {
    switch (followup.type) {
      case 'CALL': return 'Llamada';
      case 'MESSAGE': return 'Mensaje';
      case 'VISIT': return 'Visita';
      default: return 'Otro';
    }
  };

  return (
    <div className="followup-item">
      <div className={`followup-status-indicator status-${followup.status.toLowerCase()}`} />
      
      <div className="followup-icon-wrapper">
        <span className="material-symbols-outlined">{getIcon()}</span>
      </div>

      <div className="followup-content">
        <div className="followup-header">
          <div className="followup-info">
            <span className={`followup-badge ${getBadgeClass()}`}>
              {getTypeLabel()}
            </span>
            <div className="followup-meta">
              <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>schedule</span>
              {formatDate(followup.date)}
            </div>
          </div>
          
          <div className="followup-status">
            {followup.status === 'COMPLETED' ? (
              <span className="followup-badge badge-message">Completado</span>
            ) : (
              <span className="followup-badge badge-other">Pendiente</span>
            )}
          </div>
        </div>

        <div className="followup-notes">
          {followup.notes}
        </div>

        <div className="followup-footer">
          <div className="responsible-info">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
            <span>Responsable: {followup.responsibleName || 'Sistema'}</span>
          </div>

          {followup.status === 'PENDING' && onComplete && (
            <button 
              className="action-btn btn-complete"
              onClick={() => onComplete(followup.id)}
            >
              Marcar completado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowupItem;
