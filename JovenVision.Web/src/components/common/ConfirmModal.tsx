import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  loading
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fadeIn">
      <div className="modal-content animate-scaleUp">
        <div className="modal-icon-container delete">
          <span className="material-symbols-outlined">delete_forever</span>
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-description">{description}</p>
        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner" style={{ margin: '0 auto', width: '1.2rem', height: '1.2rem' }}></div>
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
