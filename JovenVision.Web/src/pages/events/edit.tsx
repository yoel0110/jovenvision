import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { EventForm } from '../../components/events/EventForm';
import { eventsService } from '../../services/eventsService';
import type { EventPayload } from '../../types/event';

export const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<EventPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string, errors: string[] } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const event = await eventsService.getEventById(Number(id));
        setInitialData({
          title: event.title,
          type: event.type,
          description: event.description || '',
          date: event.date,
          location: event.location || '',
          capacity: event.capacity,
          status: event.status,
          responsibleId: event.responsibleId,
          groupId: event.groupId
        });
      } catch (err: any) {
        setErrorState({
          message: 'No se pudo cargar la información del evento',
          errors: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (data: EventPayload) => {
    if (!id) return;
    setSaving(true);
    setErrorState(null);
    try {
      await eventsService.updateEvent(Number(id), data);
      navigate('/events');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorState({
        message: response?.message || 'Error al actualizar el evento. Por favor, intenta de nuevo.',
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
          <p style={{ color: '#64748b', fontWeight: '600' }}>Cargando datos del evento...</p>
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
                onClick={() => navigate('/events')}
                className="btn-quick"
                style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                Volver al listado
              </button>
              <h1>Editar Evento</h1>
              <p>Actualiza los detalles y la planificación de la actividad</p>
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
            <EventForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/events')}
              loading={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
