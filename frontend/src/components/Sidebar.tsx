import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Truck,
  Users,
  UserCheck,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  LogOut,
  Shield,
} from 'lucide-react';
import RoleGate from './RoleGate';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/vehicles', label: 'Vehicles', icon: <Truck size={20} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/drivers', label: 'Drivers', icon: <Users size={20} />, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/driver-requests', label: 'Driver Requests', icon: <UserCheck size={20} />, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER'] },
    { path: '/trips', label: 'Trips', icon: <Route size={20} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/maintenance', label: 'Maintenance', icon: <Wrench size={20} />, roles: ['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { path: '/fuel-expenses', label: 'Fuel & Expenses', icon: <Fuel size={20} />, roles: ['FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST'] },
    { path: '/reports', label: 'Reports', icon: <BarChart3 size={20} />, roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Truck size={24} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">TransitOps</h1>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Fleet Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RoleGate key={item.path} allowedRoles={item.roles}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </RoleGate>
          );
        })}
      </nav>

      {/* User Info / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-2 mb-3">
          <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center text-blue-400 font-bold border border-slate-700">
            {user?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Shield size={10} className="text-blue-500" />
              <span className="truncate">{user?.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all border border-slate-700 cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
