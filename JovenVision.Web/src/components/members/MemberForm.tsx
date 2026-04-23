import React, { useState, useEffect } from 'react';
import type { MemberPayload, MemberStatus } from '../../types/member';

interface MemberFormProps {
  initialData?: MemberPayload;
  onSubmit: (data: MemberPayload) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const MemberForm = ({ initialData, onSubmit, onCancel, loading }: MemberFormProps) => {
  const [formData, setFormData] = useState<MemberPayload>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      status: 'Active'
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof MemberPayload, string>>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Partial<Record<keyof MemberPayload, string>> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof MemberPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isValid = formData.firstName.trim() && formData.lastName.trim() && !Object.values(errors).some(e => e);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors">person</span>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.firstName ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm`}
              placeholder="Ej. Juan"
            />
          </div>
          {errors.firstName && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
            Apellido <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors">person</span>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.lastName ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm`}
              placeholder="Ej. Pérez"
            />
          </div>
          {errors.lastName && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
            Correo Electrónico
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors">mail</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm`}
              placeholder="juan.perez@ejemplo.com"
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
            Teléfono Móvil
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors">call</span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              placeholder="+1 (809) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
            Estado de Membresía
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors pointer-events-none">info</span>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as MemberStatus)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer font-bold text-gray-700"
            >
              <option value="Active">Activo</option>
              <option value="Inactive">Inactivo</option>
              <option value="Pending">Pendiente</option>
              <option value="Banned">Baneado</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">unfold_more</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !isValid}
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center space-x-2"
        >
          {loading && <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>}
          <span>{initialData ? 'Guardar Cambios' : 'Crear Miembro'}</span>
        </button>
      </div>
    </form>
  );
};
