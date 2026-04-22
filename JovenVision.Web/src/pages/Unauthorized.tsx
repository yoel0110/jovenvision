import { Link } from 'react-router';

export const Unauthorized = () => {
  return (
    <div className="page">
      <h1>Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/dashboard">Volver al Dashboard</Link>
    </div>
  );
};
