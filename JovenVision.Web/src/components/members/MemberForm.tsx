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
      name: '',
      email: '',
      phone: '',
      status: 'Active'
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof MemberPayload, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Partial<Record<keyof MemberPayload, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isValid = formData.name.trim() && !Object.values(errors).some(e => e);

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn">
      <div className="form-grid">
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">
            Nombre Completo <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">person</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Ej. Juan Pérez"
            />
          </div>
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Correo Electrónico
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">mail</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="juan.perez@ejemplo.com"
            />
          </div>
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Teléfono Móvil
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">call</span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="form-input"
              placeholder="+1 (809) 000-0000"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Estado de Membresía
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">info</span>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as MemberStatus)}
              className="form-select"
            >
              <option value="Active">Activo</option>
              <option value="Inactive">Inactivo</option>
              <option value="Pending">Pendiente</option>
              <option value="Banned">Baneado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !isValid}
          className="btn-form-submit"
        >
          {loading && <div className="loading-spinner"></div>}
          <span>{initialData ? 'Guardar Cambios' : 'Crear Miembro'}</span>
        </button>
      </div>
    </form>
  );
};
