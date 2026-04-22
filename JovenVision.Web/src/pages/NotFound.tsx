import { Link } from 'react-router';

export const NotFound = () => {
  return (
    <div className="page">
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Link to="/dashboard">Volver al Dashboard</Link>
    </div>
  );
};
