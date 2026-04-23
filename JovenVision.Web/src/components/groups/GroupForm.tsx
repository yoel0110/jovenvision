import React, { useState, useEffect } from 'react';
import type { GroupPayload, GroupStatus } from '../../types/group';

interface GroupFormProps {
  initialData?: GroupPayload;
  onSubmit: (data: GroupPayload) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const GroupForm = ({ initialData, onSubmit, onCancel, loading }: GroupFormProps) => {
  const [formData, setFormData] = useState<GroupPayload>(
    initialData || {
      name: '',
      description: '',
      capacity: 50,
      status: 'ACTIVE'
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof GroupPayload, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Partial<Record<keyof GroupPayload, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (formData.capacity <= 0) newErrors.capacity = 'La capacidad debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity)
      };
      await onSubmit(payload);
    }
  };

  const handleChange = (field: keyof GroupPayload, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isValid = formData.name.trim() && formData.capacity > 0 && !Object.values(errors).some(e => e);

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn">
      <div className="form-grid">
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">
            Nombre del Grupo <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">group</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Ej. Jóvenes Adultos"
            />
          </div>
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">
            Descripción
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon" style={{ top: '24px' }}>description</span>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="form-input"
              placeholder="Propósito o descripción del grupo..."
              rows={3}
              style={{ paddingTop: '16px', paddingBottom: '16px', resize: 'vertical', minHeight: '100px' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Capacidad <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">groups</span>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              className={`form-input ${errors.capacity ? 'error' : ''}`}
              placeholder="Ej. 50"
              min="1"
            />
          </div>
          {errors.capacity && <p className="field-error">{errors.capacity}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Estado del Grupo
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">info</span>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as GroupStatus)}
              className="form-select"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
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
          <span>{initialData ? 'Guardar Cambios' : 'Crear Grupo'}</span>
        </button>
      </div>
    </form>
  );
};
