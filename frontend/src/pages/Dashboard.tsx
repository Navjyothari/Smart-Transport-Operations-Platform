import { useState, useEffect } from 'react';
import api from '../lib/api';
import KpiCard from '../components/KpiCard';
import {
  Truck,
  CheckCircle2,
  Wrench,
  Navigation,
  FileClock,
  UserCheck,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardKpis {
  vehicles: {
    total: number;
    available: number;
    onTrip: number;
    inShop: number;
    retired: number;
    active: number;
  };
  trips: {
    active: number;
    pending: number;
    completedToday: number;
  };
  drivers: {
    total: number;
    onDuty: number;
    available: number;
  };
  fleetUtilization: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState('');
  const [region, setRegion] = useState('');

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (vehicleType) params.type = vehicleType;
      if (region) params.region = region;

      const { data } = await api.get('/dashboard/kpis', { params });
      setKpis(data);
    } catch (err: any) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, [vehicleType, region]);

  const handleResetFilters = () => {
    setVehicleType('');
    setRegion('');
  };

  if (loading && !kpis) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="app-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Operations Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">Live fleet availability, driver capacity, and trip activity at a glance</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="dashboard-filter-pill">
            <span>Type:</span>
            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Van">Vans</option>
              <option value="Truck">Trucks</option>
              <option value="Bus">Buses</option>
            </select>
          </div>

          <div className="dashboard-filter-pill">
            <span>Region:</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>

          {(vehicleType || region) && (
            <button onClick={handleResetFilters} className="dashboard-reset" type="button" title="Reset filters">
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="dashboard-refresh">
          <span></span>
          Refreshing live KPIs...
        </div>
      )}

      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Active Vehicles"
            value={kpis.vehicles.active}
            subtitle={`Out of ${kpis.vehicles.total} registered`}
            icon={<Truck size={22} />}
            color="blue"
          />
          <KpiCard
            title="Available Vehicles"
            value={kpis.vehicles.available}
            subtitle="Ready for dispatch"
            icon={<CheckCircle2 size={22} />}
            color="emerald"
          />
          <KpiCard
            title="In Maintenance"
            value={kpis.vehicles.inShop}
            subtitle="Currently in shop"
            icon={<Wrench size={22} />}
            color="amber"
          />
          <KpiCard
            title="Fleet Utilization"
            value={`${kpis.fleetUtilization}%`}
            subtitle="Active vehicles on trips"
            icon={<TrendingUp size={22} />}
            color="blue"
          />

          <KpiCard
            title="Active Trips"
            value={kpis.trips.active}
            subtitle="Dispatched and in transit"
            icon={<Navigation size={22} />}
            color="blue"
          />
          <KpiCard
            title="Pending Trips"
            value={kpis.trips.pending}
            subtitle="Awaiting dispatch approval"
            icon={<FileClock size={22} />}
            color="slate"
          />
          <KpiCard
            title="Available Drivers"
            value={kpis.drivers.available}
            subtitle={`Out of ${kpis.drivers.total} drivers`}
            icon={<UserCheck size={22} />}
            color="emerald"
          />
          <KpiCard
            title="Completed Today"
            value={kpis.trips.completedToday}
            subtitle="Finished trip runs"
            icon={<CheckCircle2 size={22} />}
            color="emerald"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="section-title">Operations Log Summary</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            TransitOps keeps dispatch, maintenance, and driver eligibility checks in one workspace.
            Use Trips to create and complete routes, and Maintenance to move vehicles in and out of shop status.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="dashboard-rule-card">
              <div className="text-xs font-semibold uppercase">Driver Safety Rule</div>
              <div className="text-xs mt-1">Drivers with expired licenses or suspended accounts cannot be dispatched.</div>
            </div>
            <div className="dashboard-rule-card">
              <div className="text-xs font-semibold uppercase">Odometer Progression</div>
              <div className="text-xs mt-1">Completing a trip increments the vehicle odometer by the actual distance logged.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Regional Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">North Command Center</span>
              <span className="font-semibold text-white">Active</span>
            </div>
            <div className="dashboard-progress"><div style={{ width: '45%' }}></div></div>

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-slate-400">South Hub</span>
              <span className="font-semibold text-white font-mono">Standard</span>
            </div>
            <div className="dashboard-progress"><div style={{ width: '30%' }}></div></div>

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-slate-400">East and West Outposts</span>
              <span className="font-semibold text-white font-mono">Secondary</span>
            </div>
            <div className="dashboard-progress"><div style={{ width: '25%' }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}