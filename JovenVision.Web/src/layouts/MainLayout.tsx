import { Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/members', label: 'Miembros' },
  { path: '/groups', label: 'Grupos' },
  { path: '/events', label: 'Eventos' },
];

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-brand">JovenVision</div>
        <div className="header-user">
          <span>{user?.username}</span>
          <button onClick={logout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="main-body">
        <aside className="main-sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
