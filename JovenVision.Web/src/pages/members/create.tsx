import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MemberForm } from '../../components/members/MemberForm';
import { membersService } from '../../services/membersService';
import type { MemberPayload } from '../../types/member';

export const CreateMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: MemberPayload) => {
    setLoading(true);
    setError(null);
    try {
      await membersService.createMember(data);
      navigate('/members');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el miembro. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
                Nuevo Miembro
              </h1>
              <p className="text-sm text-gray-500 mt-1">Registra la información de un nuevo integrante del ministerio</p>
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
