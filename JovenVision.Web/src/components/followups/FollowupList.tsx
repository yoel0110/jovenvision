import React from 'react';
import type { FollowUp } from '../../types/followup';
import FollowupItem from './FollowupItem';

interface FollowupListProps {
  followups: FollowUp[];
  loading?: boolean;
  onUpdateStatus?: (id: number, status: 'PENDING' | 'COMPLETED') => void;
}

const FollowupList: React.FC<FollowupListProps> = ({ followups, loading, onUpdateStatus }) => {
  if (loading) {
    return (
      <div className="followup-list-loading">
        {[1, 2, 3].map(i => (
          <div key={i} className="followup-item skeleton" style={{ height: '140px', marginBottom: '1rem', background: '#f1f5f9', opacity: 0.5 }} />
        ))}
      </div>
    );
  }

  if (followups.length === 0) {
    return (
      <div className="empty-followups">
        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>comments_disabled</span>
        <p>No hay seguimientos registrados para este miembro.</p>
      </div>
    );
  }

  return (
    <div className="followup-list">
      {followups.map(f => (
        <FollowupItem 
          key={f.id} 
          followup={f} 
          onComplete={(id) => onUpdateStatus?.(id, 'COMPLETED')}
        />
      ))}
    </div>
  );
};

export default FollowupList;
