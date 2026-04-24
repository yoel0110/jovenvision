import { useState} from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-split-layout">
      {/* Lado de la Imagen Informativa */}
      <div className="login-visual-panel">
        <div className="visual-overlay"></div>
        {/* La imagen se carga via CSS para mejor control de escalado */}
      </div>

      {/* Lado del Formulario */}
      <div className="login-form-panel">
        <div className="login-form-container animate-fadeInRight">
          <div className="form-header">
            <div className="header-icon-circle">
              <span className="material-symbols-outlined">groups</span>
              <div className="icon-plus">+</div>
            </div>
            <h2 className="welcome-title">Bienvenido</h2>
            <p className="welcome-subtitle">Inicia sesión para continuar</p>
          </div>

          {error && <div className="login-error animate-shake">{error}</div>}

          <form onSubmit={handleSubmit} className="premium-form-content">
            <div className="form-group-premium">
              <label className="input-label">Correo Electrónico</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  type="email"
                  placeholder="juan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-premium">
              <label className="input-label">Contraseña</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined password-toggle">visibility</span>
              </div>
            </div>

            <div className="form-actions-premium">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkbox-custom"></span>
                Recordarme
              </label>
              <a href="#" className="link-forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="btn-submit-premium">
              Entrar
            </button>
          </form>

          <div className="login-footer-premium">
            <p>© 2024 JovenVision. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
