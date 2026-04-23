import React, { useState, useEffect } from 'react';
import type { EventPayload, EventType, EventStatus } from '../../types/event';
import { groupsService } from '../../services/groupsService';
import type { Group } from '../../types/group';

interface EventFormProps {
  initialData?: EventPayload;
  onSubmit: (data: EventPayload) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const EventForm = ({ initialData, onSubmit, onCancel, loading }: EventFormProps) => {
  const [formData, setFormData] = useState<EventPayload>(
    initialData || {
      title: '',
      type: 'ACTIVITY',
      description: '',
      date: new Date().toISOString().slice(0, 16), // Current date-time for local input
      location: '',
      capacity: 10,
      status: 'ACTIVE',
      responsibleId: undefined,
      groupId: undefined
    }
  );

  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventPayload, string>>>({});

  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true);
      try {
        const response = await groupsService.getGroups({ pageSize: 100 });
        const groupsData = Array.isArray(response) ? response : (response as any).data || [];
        setGroups(groupsData);
        console.log(`Cargados ${groupsData.length} grupos`);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Ensure date is in YYYY-MM-DDThh:mm format for datetime-local input
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '';
      setFormData({ ...initialData, date: formattedDate });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Partial<Record<keyof EventPayload, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (formData.capacity <= 0) newErrors.capacity = 'La capacidad debe ser mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Convert date back to ISO string before submitting
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        capacity: Number(formData.capacity)
      };
      await onSubmit(payload);
    }
  };

  const handleChange = (field: keyof EventPayload, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si se selecciona un grupo, sincronizamos automáticamente la capacidad
      if (field === 'groupId' && value) {
        const selectedGroup = groups.find(g => g.id === value);
        if (selectedGroup) {
          newData.capacity = selectedGroup.capacity;
        }
      }
      
      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isValid = formData.title.trim() && formData.date && formData.capacity > 0;

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn">
      <div className="form-grid">
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">
            Título del Evento <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">title</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Ej. Taller de Liderazgo"
            />
          </div>
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Tipo de Evento <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">category</span>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as EventType)}
              className="form-select"
            >
              <option value="MEETING">Reunión</option>
              <option value="ACTIVITY">Actividad</option>
              <option value="TRAINING">Capacitación</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>
            Grupo Asignado
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">groups</span>
            <select
              value={formData.groupId || ''}
              onChange={(e) => handleChange('groupId', e.target.value ? Number(e.target.value) : undefined)}
              className="form-select"
              disabled={loadingGroups}
            >
              <option value="">Ninguno / Público</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          {formData.groupId && groups.some(g => g.id === formData.groupId) && (
            <div className="animate-fadeIn" style={{ 
              marginTop: '12px', 
              padding: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--primary)' }}>groups</span>
                <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                  Este evento se publicará para el grupo: <strong>{groups.find(g => g.id === formData.groupId)?.name}</strong>
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                  Capacidad del grupo: {groups.find(g => g.id === formData.groupId)?.capacity}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Fecha y Hora <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">calendar_today</span>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`form-input ${errors.date ? 'error' : ''}`}
            />
          </div>
          {errors.date && <p className="field-error">{errors.date}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Ubicación
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">location_on</span>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="form-input"
              placeholder="Ej. Salón Multiusos"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Capacidad Máxima <span>*</span>
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">group</span>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              className={`form-input ${errors.capacity ? 'error' : ''}`}
              min="1"
              disabled={!!formData.groupId}
              style={formData.groupId ? { backgroundColor: '#f8fafc', cursor: 'not-allowed', color: '#64748b' } : {}}
            />
          </div>
          {formData.groupId && (
            <p className="field-info" style={{ marginTop: '4px', fontSize: '0.75rem', color: '#64748b' }}>
              La capacidad está limitada por el grupo seleccionado.
            </p>
          )}
          {errors.capacity && <p className="field-error">{errors.capacity}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Estado
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">info</span>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as EventStatus)}
              className="form-select"
            >
              <option value="ACTIVE">Activo</option>
              <option value="PENDING">Pendiente</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">
            Descripción
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>description</span>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="form-input"
              style={{ minHeight: '100px', paddingTop: '10px' }}
              placeholder="Detalles adicionales del evento..."
            />
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
          <span>{initialData ? 'Guardar Cambios' : 'Crear Evento'}</span>
        </button>
      </div>
    </form>
  );
};
