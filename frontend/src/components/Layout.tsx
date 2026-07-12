import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-card">
          <div className="app-spinner"></div>
          <p>Loading TransitOps...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-workspace">
        <TopBar />
        <main className={`app-main ${isDashboard ? 'dashboard-main' : 'workspace-main'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}