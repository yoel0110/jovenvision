import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useFollowups } from '../../hooks/useFollowups';
import FollowupForm from '../../components/followups/FollowupForm';
import FollowupList from '../../components/followups/FollowupList';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/followups.css';

const MemberFollowups: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { followups, loading, error, fetchByMember, create, updateStatus } = useFollowups();

  useEffect(() => {
    if (memberId) {
      fetchByMember(parseInt(memberId));
    }
  }, [memberId, fetchByMember]);

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="header-title">
            <h1>Seguimiento de Miembro</h1>
            <p>Registra y consulta interacciones de retención</p>
          </div>
        </div>
      </header>

      <main className="followups-container">
        <section className="followup-section">
          <h2 className="section-title">Nuevo Registro</h2>
          {memberId && (
            <FollowupForm 
              memberId={parseInt(memberId)} 
              onSubmit={async (data) => { 
                await create({ ...data, responsibleId: user?.id });
              }}
              loading={loading}
            />
          )}
        </section>

        <section className="followup-section">
          <h2 className="section-title">Historial de Interacciones</h2>
          <FollowupList 
            followups={followups} 
            loading={loading}
            onUpdateStatus={updateStatus}
          />
        </section>
      </main>
    </div>
  );
};

export default MemberFollowups;
