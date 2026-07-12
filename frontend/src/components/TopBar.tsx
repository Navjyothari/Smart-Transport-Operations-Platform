import { useAuth } from '../contexts/AuthContext';
import { Shield, Bell, Search, User } from 'lucide-react';

export default function TopBar() {
  const { user } = useAuth();

  const roleColors: Record<string, string> = {
    FLEET_MANAGER: 'bg-blue-900/60 text-blue-400 border border-blue-700/50',
    DRIVER: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50',
    SAFETY_OFFICER: 'bg-purple-900/60 text-purple-400 border border-purple-700/50',
    FINANCIAL_ANALYST: 'bg-amber-900/60 text-amber-400 border border-amber-700/50',
  };

  const getRoleLabel = (role: string) => {
    return role.split('_').join(' ');
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
      {/* Search Input Placeholder */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Quick search registration, license, source..."
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Right Side Widgets */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon */}
        <button className="text-slate-400 hover:text-slate-200 transition-colors relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        {/* User profile & Role Badge */}
        <div className="flex items-center gap-3">
          <span className={`badge ${roleColors[user?.role || ''] || 'bg-slate-800 text-slate-300'}`}>
            <Shield size={12} className="inline mr-1" />
            {getRoleLabel(user?.role || '')}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
