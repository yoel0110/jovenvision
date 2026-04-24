import React, { useState} from 'react';
import { useNavigate } from 'react-router';
import type { User, UserPayload } from '../../types/user';
import type { Member } from '../../types';

interface UserFormProps {
  initialData?: User;
  members: Member[];
  allUsers: User[];
  onSubmit: (data: UserPayload) => Promise<void>;
  loading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  initialData, 
  members, 
  allUsers, 
  onSubmit, 
  loading 
}) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<UserPayload>({
    username: initialData?.username || '',
    password: '',
    roleId: initialData?.roleId || 3, // 3 = Usuario Estandar
    memberId: initialData?.memberId || 0,
    active: initialData?.active ?? true
  });

  const [error, setError] = useState<string | null>(null);

  const availableMembers = members.filter(member => {
    if (member.status !== "Active") return false;
    const isAssigned = allUsers.some(u => Number(u.memberId) === Number(member.id));
    const isMyMember = isEditing && Number(initialData?.memberId) === Number(member.id);
    return !isAssigned || isMyMember;
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'roleId' || name === 'memberId' ? parseInt(value) : value 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }

    if (!isEditing && !formData.password) {
      setError('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (!formData.memberId || formData.memberId === 0) {
      setError('Debe seleccionar un miembro a vincular');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el usuario');
    }
  };

  return (
    <form className="form-container animate-fadeInUp" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-grid">
        <div className="form-group">
          <label>Nombre de Usuario <span className="required">*</span></label>
          <div className="input-container">
            <span className="material-symbols-outlined">person</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Ej: jdoe"
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contraseña {isEditing ? '(nueva para cambiar)' : <span className="required">*</span>}</label>
          <div className="input-container">
            <span className="material-symbols-outlined">lock</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder={isEditing ? 'Mantener actual o nueva' : 'Mínimo 8 caracteres'}
              required={!isEditing}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Rol en el Sistema <span className="required">*</span></label>
          <div className="input-container">
            <span className="material-symbols-outlined">shield_person</span>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            >
              <option value={2}>Líder</option>
              <option value={3}>Usuario Estándar</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Miembro Vinculado <span className="required">*</span></label>
          <div className="input-container">
            <span className="material-symbols-outlined">group</span>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            >
              <option value={0}>-- Seleccione un Miembro --</option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.phone})
                </option>
              ))}
            </select>
          </div>
          {availableMembers.length === 0 && !isEditing && (
             <small style={{color: 'var(--danger)', marginTop: '4px', display: 'block'}}>
               No hay miembros disponibles sin usuario.
             </small>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              disabled={loading}
            />
            <span>
              Usuario Activo (Puede iniciar sesión)
            </span>
          </label>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span className="material-symbols-outlined">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/users')}
          disabled={loading}
        >
          <span className="material-symbols-outlined">close</span>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="material-symbols-outlined spinning">sync</span>
              Guardando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
