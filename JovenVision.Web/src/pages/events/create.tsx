import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { EventForm } from '../../components/events/EventForm';
import { eventsService } from '../../services/eventsService';
import type { EventPayload } from '../../types/event';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string, errors: string[] } | null>(null);

  const handleSubmit = async (data: EventPayload) => {
    setLoading(true);
    setErrorState(null);
    try {
      await eventsService.createEvent(data);
      navigate('/events');
    } catch (err: any) {
      const response = err.response?.data;
      setErrorState({
        message: response?.message || 'Error al crear el evento. Por favor, intenta de nuevo.',
        errors: response?.errors || []
      });
    } finally {
      setLoading(false);
    }
  };

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
              <h1>Nuevo Evento</h1>
              <p>Planifica y registra los detalles de una nueva actividad o reunión</p>
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

          <EventForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/events')}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
