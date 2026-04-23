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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      try {
        const member = await membersService.getMemberById(id);
        setInitialData({
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email || '',
          phone: member.phone || '',
          status: member.status
        });
      } catch (err) {
        setError('No se pudo cargar la información del miembro');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleSubmit = async (data: MemberPayload) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await membersService.updateMember(id, data);
      navigate('/members');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el miembro. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-medium">Cargando datos del miembro...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fadeInUp">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-header px-6 py-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <button
                onClick={() => navigate('/members')}
                className="flex items-center text-xs font-bold text-blue-500 hover:text-blue-700 transition-all mb-2 uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
                Volver al listado
              </button>
              <h1 className="text-3xl font-bold text-gradient-blue">
                Editar Miembro
              </h1>
              <p className="text-sm text-gray-500 mt-1">Actualiza la información del integrante del ministerio</p>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600 animate-fadeInUp shadow-sm">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-lg">error</span>
              </div>
              <p className="text-sm font-semibold">{error}</p>
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
