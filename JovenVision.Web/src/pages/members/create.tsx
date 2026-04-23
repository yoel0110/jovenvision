import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MemberForm } from '../../components/members/MemberForm';
import { membersService } from '../../services/membersService';
import type { MemberPayload } from '../../types/member';

export const CreateMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string, errors: string[] } | null>(null);

  const handleSubmit = async (data: MemberPayload) => {
    setLoading(true);
    setErrorState(null);
    try {
      await membersService.createMember(data);
      navigate('/members');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorState({
        message: response?.message || 'Error al crear el miembro. Por favor, intenta de nuevo.',
        errors: response?.errors || []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-fadeInUp">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-text">
              <button
                onClick={() => navigate('/members')}
                className="btn-quick"
                style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                Volver al listado
              </button>
              <h1>Nuevo Miembro</h1>
              <p>Registra la información de un nuevo integrante del ministerio</p>
            </div>
          </div>
        </div>

        <div className="form-container">
          {errorState && (
            <div className="error-list-container">
              <div className="error-list-icon">
                <span className="material-symbols-outlined">error</span>
              </div>
              <div className="error-list-content">
                <h4>{errorState.message}</h4>
                {errorState.errors.length > 0 && (
                  <ul>
                    {errorState.errors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <MemberForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/members')}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMember;
