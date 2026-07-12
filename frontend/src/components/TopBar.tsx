import { useAuth } from '../contexts/AuthContext';
import { Bell, ChevronDown, MapPin, Search, Shield, SlidersHorizontal } from 'lucide-react';

export default function TopBar() {
  const { user } = useAuth();

  const getRoleLabel = (role: string) => role.split('_').join(' ');

  return (
    <header className="dashboard-topbar">
      <label className="topbar-search">
        <Search size={19} />
        <input type="text" placeholder="Search vehicles, drivers, trips..." />
      </label>

      <div className="topbar-actions">
        <button className="topbar-filter" type="button">
          <MapPin size={15} />
          <span>Hub:</span>
          <strong>North Fleet</strong>
          <ChevronDown size={15} />
        </button>

        <button className="topbar-filter" type="button">
          <SlidersHorizontal size={15} />
          <span>Mode:</span>
          <strong>Live</strong>
          <ChevronDown size={15} />
        </button>

        <button className="topbar-bell" type="button" title="Notifications">
          <Bell size={18} />
          <span></span>
        </button>

        <div className="topbar-user">
          <span className="topbar-avatar">{user?.name?.charAt(0) || 'U'}</span>
          <span className="topbar-user-copy">
            <strong>{user?.name || 'User'}</strong>
            <span>
              <Shield size={11} />
              {getRoleLabel(user?.role || '')}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}