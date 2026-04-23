import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GroupForm } from '../../components/groups/GroupForm';
import { groupsService } from '../../services/groupsService';
import type { GroupPayload } from '../../types/group';

export const CreateGroup = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string, errors: string[] } | null>(null);

  const handleSubmit = async (data: GroupPayload) => {
    setSaving(true);
    setErrorState(null);
    try {
      await groupsService.createGroup(data);
      navigate('/groups');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorState({
        message: response?.message || 'Error al crear el grupo. Por favor, intenta de nuevo.',
        errors: response?.errors || []
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container animate-fadeInUp">
      <div className="header-card">
        <div className="header-content">
          <div className="header-info">
            <div className="header-text">
              <button 
                onClick={() => navigate('/groups')} 
                className="btn-quick"
                style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                Volver al listado
              </button>
              <h1>Nuevo Grupo</h1>
              <p>Agrega un nuevo grupo o ministerio al sistema</p>
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

          <GroupForm 
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/groups')}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
};
