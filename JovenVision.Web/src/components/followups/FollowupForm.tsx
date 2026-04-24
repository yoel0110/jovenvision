import React, { useState } from 'react';
import type { FollowUpPayload, FollowUpType } from '../../types/followup';

interface FollowupFormProps {
  memberId: number;
  onSubmit: (data: FollowUpPayload) => Promise<void>;
  loading?: boolean;
}

const FollowupForm: React.FC<FollowupFormProps> = ({ memberId, onSubmit, loading }) => {
  const [type, setType] = useState<FollowUpType>('CALL');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    try {
      await onSubmit({
        memberId,
        type,
        description: notes,
        status,
        date: new Date().toISOString()
      });
      setNotes('');
    } catch (error) {
      console.error('Error submitting followup:', error);
    }
  };

  return (
    <div className="followup-form-card">
      <form className="followup-form" onSubmit={handleSubmit}>
        <div className="form-group-row">
          <div className="followup-input-group">
            <label>Tipo de Seguimiento</label>
            <select 
              className="followup-select"
              value={type}
              onChange={(e) => setType(e.target.value as FollowUpType)}
            >
              <option value="CALL">Llamada</option>
              <option value="MESSAGE">Mensaje</option>
              <option value="VISIT">Visita</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div className="followup-input-group">
            <label>Estado Inicial</label>
            <select 
              className="followup-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="PENDING">Pendiente</option>
              <option value="COMPLETED">Completado</option>
            </select>
          </div>
        </div>

        <div className="followup-input-group">
          <label>Notas / Observaciones</label>
          <textarea
            className="followup-textarea"
            placeholder="Describe la interacción..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !notes.trim()}>
          {loading ? (
            <span className="material-symbols-outlined animate-spin">sync</span>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              <span>Registrar Seguimiento</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FollowupForm;
