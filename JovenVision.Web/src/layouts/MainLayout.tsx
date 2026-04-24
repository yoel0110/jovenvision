import { Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/members', label: 'Miembros', icon: 'group' },
  { path: '/groups', label: 'Grupos', icon: 'hub' },
  { path: '/events', label: 'Eventos', icon: 'event' },
  { path: '/attendance/event', label: 'Asistencia', icon: 'how_to_reg' },
  { path: '/attendance/member', label: 'Historial', icon: 'person_search' },
];

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-brand-container">
          <div className="header-brand">JovenVision</div>
        </div>
        
        <div className="header-user">
          <div className="user-info">
            <span className="username">{user?.username}</span>
            <span className="role">Administrador</span>
          </div>
          <button 
            onClick={logout} 
            className="btn-logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Salir</span>
          </button>
        </div>
      </header>

      <div className="main-body">
        <aside className="main-sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="main-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
