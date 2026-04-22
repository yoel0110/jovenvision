import { Outlet } from 'react-router';

export const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Outlet />
    </div>
  );
};
