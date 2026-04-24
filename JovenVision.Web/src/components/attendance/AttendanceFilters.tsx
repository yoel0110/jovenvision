import type { JovenEvent } from '../../types/event';
import '../../styles/components/attendance.css';

interface AttendanceFiltersProps {
  events: JovenEvent[];
  selectedEventId?: number;
  onEventChange: (eventId: number) => void;
  loading?: boolean;
}

export const AttendanceFilters = ({ events, selectedEventId, onEventChange, loading }: AttendanceFiltersProps) => {
  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="attendance-filters card animate-fadeIn">
      <div className="filter-row">
        <div className="form-group">
          <label className="form-label">Seleccionar Evento</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">event</span>
            <select
              value={selectedEventId || ''}
              onChange={(e) => onEventChange(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="" disabled>-- Seleccione un evento --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="event-info-panel animate-slideIn">
          <div className="info-item">
            <span className="material-symbols-outlined">calendar_today</span>
            <div>
              <label>Fecha y Hora</label>
              <span>{new Date(selectedEvent.date).toLocaleString()}</span>
            </div>
          </div>
          <div className="info-item">
            <span className="material-symbols-outlined">location_on</span>
            <div>
              <label>Ubicación</label>
              <span>{selectedEvent.location || 'No especificada'}</span>
            </div>
          </div>
          <div className="info-item">
            <span className="material-symbols-outlined">groups</span>
            <div>
              <label>Grupo</label>
              <span>{selectedEvent.group?.name || 'Público General'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
