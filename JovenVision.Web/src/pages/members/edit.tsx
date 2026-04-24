import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MemberForm } from '../../components/members/MemberForm';
import { membersService } from '../../services/membersService';
import type { MemberPayload } from '../../types/member';

export const EditMember = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<MemberPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string, errors: string[] } | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      try {
        const member = await membersService.getMemberById(Number(id));
        setInitialData({
          name: member.name,
          email: member.email || '',
          phone: member.phone || '',
          status: member.status
        });
      } catch (err: any) {
        setErrorState({
          message: 'No se pudo cargar la información del miembro',
          errors: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleSubmit = async (data: MemberPayload) => {
    if (!id) return;
    setSaving(true);
    setErrorState(null);
    try {
      await membersService.updateMember(Number(id), data);
      navigate('/members');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorState({
        message: response?.message || 'Error al actualizar el miembro. Por favor, intenta de nuevo.',
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
          <p style={{ color: '#64748b', fontWeight: '600' }}>Cargando datos del miembro...</p>
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
                onClick={() => navigate('/members')}
                className="btn-quick"
                style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                Volver al listado
              </button>
              <h1>Editar Miembro</h1>
              <p>Actualiza la información del integrante del ministerio</p>
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
            <MemberForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/members')}
              loading={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMember;
