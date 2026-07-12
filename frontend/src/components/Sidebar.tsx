import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  Fuel,
  Gauge,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';
import RoleGate from './RoleGate';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const quickItems = [
    { label: 'Operations', icon: <Gauge size={17} />, badge: 'Live' },
    { label: 'Alerts', icon: <Bell size={17} />, badge: '3' },
  ];

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/vehicles', label: 'Vehicles', icon: <Truck size={18} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/drivers', label: 'Drivers', icon: <Users size={18} />, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/driver-requests', label: 'Driver Applications', icon: <ClipboardCheck size={18} />, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
    { path: '/trips', label: 'Trips', icon: <Route size={18} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/maintenance', label: 'Maintenance', icon: <Wrench size={18} />, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/fuel-expenses', label: 'Fuel & Expenses', icon: <Fuel size={18} />, roles: ['FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST'] },
    { path: '/reports', label: 'Reports', icon: <BarChart3 size={18} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-main">
        <Link to="/dashboard" className="sidebar-brand" aria-label="TransitOps dashboard">
          <span className="brand-symbol" aria-hidden="true">
            <Truck size={18} />
          </span>
          <span className="brand-copy">
            <span className="brand-title">TransitOps</span>
            <span className="brand-subtitle">PRO Fleet Suite</span>
          </span>
        </Link>

        <div className="sidebar-search-mini">
          <Search size={15} />
          <span>Find route or unit</span>
        </div>

        <div className="sidebar-quick">
          {quickItems.map((item) => (
            <button key={item.label} className="sidebar-quick-item" type="button">
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-badge">{item.badge}</span>
            </button>
          ))}
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <RoleGate key={item.path} allowedRoles={item.roles}>
                <Link className={`sidebar-link ${isActive ? 'active' : ''}`} to={item.path}>
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </RoleGate>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link to="/trips" className="create-shipment">
          <Plus size={17} />
          <span className="sidebar-label">Plan trip</span>
        </Link>

        <div className="sidebar-profile">
          <div className="profile-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="profile-copy">
            <span className="profile-name">{user?.name || 'User'}</span>
            <span className="profile-role">
              <ShieldCheck size={11} />
              {user?.role?.replace('_', ' ') || 'Workspace'}
            </span>
          </div>
          <button className="profile-menu" type="button" title="Account options">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <button onClick={logout} className="sidebar-logout" type="button">
          <LogOut size={16} />
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}