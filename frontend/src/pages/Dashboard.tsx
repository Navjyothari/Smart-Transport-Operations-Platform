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
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Operations Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time status of fleet vehicles, driver schedules, and trip logs</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1">
            <span className="text-xs font-semibold text-slate-500 mr-2 uppercase">Type:</span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-transparent text-sm text-slate-200 border-none outline-none pr-4 cursor-pointer focus:ring-0"
            >
              <option value="" className="bg-slate-900">All Types</option>
              <option value="Van" className="bg-slate-900">Vans</option>
              <option value="Truck" className="bg-slate-900">Trucks</option>
              <option value="Bus" className="bg-slate-900">Buses</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1">
            <span className="text-xs font-semibold text-slate-500 mr-2 uppercase">Region:</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-sm text-slate-200 border-none outline-none pr-4 cursor-pointer focus:ring-0"
            >
              <option value="" className="bg-slate-900">All Regions</option>
              <option value="North" className="bg-slate-900">North</option>
              <option value="South" className="bg-slate-900">South</option>
              <option value="East" className="bg-slate-900">East</option>
              <option value="West" className="bg-slate-900">West</option>
            </select>
          </div>

          {(vehicleType || region) && (
            <button
              onClick={handleResetFilters}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="mb-4 text-xs text-blue-400 animate-pulse font-medium">
          Refreshing real-time KPIs...
        </div>
      )}

      {/* KPI Cards Grid */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Total Active Vehicles"
            value={kpis.vehicles.active}
            subtitle={`Out of ${kpis.vehicles.total} total registered`}
            icon={<Truck size={22} />}
            color="slate"
          />
          <KpiCard
            title="Available Vehicles"
            value={kpis.vehicles.available}
            subtitle="Ready for immediate dispatch"
            icon={<CheckCircle2 size={22} />}
            color="emerald"
          />
          <KpiCard
            title="Vehicles in Maintenance"
            value={kpis.vehicles.inShop}
            subtitle="Currently undergoing repairs"
            icon={<Wrench size={22} />}
            color="amber"
          />
          <KpiCard
            title="Fleet Utilization"
            value={`${kpis.fleetUtilization}%`}
            subtitle="Active vehicles currently on trips"
            icon={<TrendingUp size={22} />}
            color="blue"
          />

          <KpiCard
            title="Active Trips"
            value={kpis.trips.active}
            subtitle="Dispatched and currently in transit"
            icon={<Navigation size={22} />}
            color="blue"
          />
          <KpiCard
            title="Pending Trips (Draft)"
            value={kpis.trips.pending}
            subtitle="Awaiting fleet dispatch approval"
            icon={<FileClock size={22} />}
            color="slate"
          />
          <KpiCard
            title="Available Drivers"
            value={kpis.drivers.available}
            subtitle={`Out of ${kpis.drivers.total} total drivers`}
            icon={<UserCheck size={22} />}
            color="emerald"
          />
          <KpiCard
            title="Trips Completed Today"
            value={kpis.trips.completedToday}
            subtitle="Full lifecycle trips finished today"
            icon={<CheckCircle2 size={22} />}
            color="emerald"
          />
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="section-title">Operations Log Summary</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            TransitOps enforces strict business policies regarding driver and vehicle state changes.
            Navigate to the <span className="text-blue-400 font-semibold">Trips</span> tab to create, dispatch, and complete delivery runs. Vehicle servicing can be recorded in the <span className="text-blue-400 font-semibold">Maintenance</span> registry to transactionally route them to shop work.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-900 border border-slate-700/60 rounded-lg p-3 flex-1 min-w-[200px]">
              <div className="text-xs font-semibold text-slate-500 uppercase">Driver Safety Rule</div>
              <div className="text-xs text-slate-300 mt-1">Drivers with expired commercial licenses or suspended accounts cannot be dispatched under any circumstances.</div>
            </div>
            <div className="bg-slate-900 border border-slate-700/60 rounded-lg p-3 flex-1 min-w-[200px]">
              <div className="text-xs font-semibold text-slate-500 uppercase">Odometer Progression</div>
              <div className="text-xs text-slate-300 mt-1">Completing a trip transactionally increments the vehicle's odometer by the actual distance logged.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Regional Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">North Command Center</span>
              <span className="font-semibold text-white">Active Operations</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-slate-400">South Hub</span>
              <span className="font-semibold text-white font-mono">Standard Fleet</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-slate-400">East and West Outposts</span>
              <span className="font-semibold text-white font-mono">Secondary</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
