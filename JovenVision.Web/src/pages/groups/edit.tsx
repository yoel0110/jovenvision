import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { GroupForm } from '../../components/groups/GroupForm';
import { groupsService } from '../../services/groupsService';
import type { GroupPayload } from '../../types/group';

export const EditGroup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<GroupPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string, errors: string[] } | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return;
      try {
        const group = await groupsService.getGroupById(Number(id));
        setInitialData({
          name: group.name,
          description: group.description || '',
          leaderId: group.leaderId,
          status: group.status
        });
      } catch (err: any) {
        setErrorState({
          message: 'No se pudo cargar la información del grupo',
          errors: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const handleSubmit = async (data: GroupPayload) => {
    if (!id) return;
    setSaving(true);
    setErrorState(null);
    try {
      await groupsService.updateGroup(Number(id), data);
      navigate('/groups');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorState({
        message: response?.message || 'Error al actualizar el grupo. Por favor, intenta de nuevo.',
        errors: response?.errors || []
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--primary)' }}></div>
          <p style={{ color: '#64748b', fontWeight: '600' }}>Cargando datos del grupo...</p>
        </div>
      </div>
    );
  }

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
              <h1>Editar Grupo</h1>
              <p>Actualiza la información del grupo o ministerio</p>
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

          {initialData && (
            <GroupForm 
              initialData={initialData}
              onSubmit={handleSubmit} 
              onCancel={() => navigate('/groups')}
              loading={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};
