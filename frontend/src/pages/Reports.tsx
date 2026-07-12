import { useState, useEffect } from 'react';
import api from '../lib/api';
import { FileSpreadsheet, Percent, Wrench, Fuel, Landmark, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

interface FuelEfficiency {
  vehicleId: string;
  registrationNumber: string;
  name: string;
  type: string;
  totalDistanceKm: number;
  totalFuelConsumedL: number;
  fuelEfficiencyKmPerL: number;
  totalFuelCost: number;
}

interface FleetUtilization {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesOnTrip: number;
  fleetUtilizationPercent: number;
  recentCompletedTrips: number;
}

interface OperationalCost {
  vehicleId: string;
  registrationNumber: string;
  name: string;
  fuelCost: number;
  maintenanceCost: number;
  otherExpenses: number;
  totalOperationalCost: number;
}

interface VehicleRoi {
  vehicleId: string;
  registrationNumber: string;
  name: string;
  acquisitionCost: number;
  totalRevenue: number;
  fuelCost: number;
  maintenanceCost: number;
  roi: number;
  roiPercent: number;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'fuel' | 'utilization' | 'cost' | 'roi'>('fuel');
  const [loading, setLoading] = useState(true);

  // States for report data
  const [fuelData, setFuelData] = useState<FuelEfficiency[]>([]);
  const [utilData, setUtilData] = useState<FleetUtilization | null>(null);
  const [costData, setCostData] = useState<OperationalCost[]>([]);
  const [roiData, setRoiData] = useState<VehicleRoi[]>([]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'fuel') {
        const { data } = await api.get('/reports/fuel-efficiency');
        setFuelData(data);
      } else if (activeTab === 'utilization') {
        const { data } = await api.get('/reports/fleet-utilization');
        setUtilData(data);
      } else if (activeTab === 'cost') {
        const { data } = await api.get('/reports/operational-cost');
        setCostData(data);
      } else if (activeTab === 'roi') {
        const { data } = await api.get('/reports/vehicle-roi');
        setRoiData(data);
      }
    } catch (err) {
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const handleExportCsv = (type: string) => {
    window.open(`/api/reports/export.csv?type=${type}`, '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Reports & Fleet Analytics</h2>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            Financial auditing, utilization rates, and fuel efficiency metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv('vehicles')}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            Export Vehicles
          </button>
          <button
            onClick={() => handleExportCsv('trips')}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            Export Trips
          </button>
          <button
            onClick={() => handleExportCsv('expenses')}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            Export Expenses
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'fuel'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Fuel Efficiency (km/L)
        </button>
        <button
          onClick={() => setActiveTab('utilization')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'utilization'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Fleet Utilization (%)
        </button>
        <button
          onClick={() => setActiveTab('cost')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'cost'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Operational Cost ($)
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'roi'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Vehicle ROI (%)
        </button>
      </div>

      {/* Main Content Loading */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: FUEL EFFICIENCY */}
          {activeTab === 'fuel' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-2">
                <h3 className="section-title">Fuel Efficiency Chart (km/L)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fuelData}>
                      <XAxis dataKey="registrationNumber" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" km/L" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="fuelEfficiencyKmPerL" radius={[4, 4, 0, 0]}>
                        {fuelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fuelEfficiencyKmPerL > 0 ? '#3b82f6' : '#475569'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card space-y-4">
                <h3 className="section-title">Refueling Breakdown</h3>
                <p className="text-xs text-slate-400">
                  Efficiency is computed as: <code className="text-blue-400">totalDistance / totalFuelConsumed</code> (km/L). It uses both actual trip logs and refueling records.
                </p>
                <div className="space-y-3">
                  {fuelData.map((d) => (
                    <div key={d.vehicleId} className="flex justify-between items-center text-xs p-2 bg-slate-900/60 rounded border border-slate-800">
                      <div>
                        <div className="font-bold text-slate-200">{d.registrationNumber} — {d.name}</div>
                        <div className="text-slate-500 mt-0.5">Dist: {d.totalDistanceKm}km | Fuel: {d.totalFuelConsumedL}L</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-400 text-sm">{d.fuelEfficiencyKmPerL} km/L</div>
                        <div className="text-slate-500 font-mono">${d.totalFuelCost.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UTILIZATION RATE */}
          {activeTab === 'utilization' && utilData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card flex flex-col justify-between">
                <div>
                  <h3 className="section-title flex items-center gap-2">
                    <Percent size={18} className="text-blue-500" />
                    Utilization KPI Summary
                  </h3>
                  <div className="text-4xl font-extrabold text-blue-400 mt-4">{utilData.fleetUtilizationPercent}%</div>
                  <p className="text-xs text-slate-400 mt-1">Total active vehicles on trips relative to total active non-retired fleet count</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fleet Vehicles:</span>
                    <span className="font-bold">{utilData.totalVehicles} registered</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active (excluding Retired):</span>
                    <span className="font-bold">{utilData.activeVehicles} active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Currently On Trip:</span>
                    <span className="font-bold text-blue-400">{utilData.vehiclesOnTrip} dispatched</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weekly Finished Runs:</span>
                    <span className="font-bold text-emerald-400">{utilData.recentCompletedTrips} runs</span>
                  </div>
                </div>
              </div>

              <div className="card lg:col-span-2">
                <h3 className="section-title">Fleet Dispatch Ratios</h3>
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-400">DISPATCHED (ON TRIP)</span>
                      <span className="text-white">{utilData.vehiclesOnTrip} vehicles</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${utilData.fleetUtilizationPercent}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-400">STANDBY / AVAILABLE</span>
                      <span className="text-white">{utilData.activeVehicles - utilData.vehiclesOnTrip} vehicles</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${100 - utilData.fleetUtilizationPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OPERATIONAL COST */}
          {activeTab === 'cost' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-2">
                <h3 className="section-title">Operational Cost Breakdown ($)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData}>
                      <XAxis dataKey="registrationNumber" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" $" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="totalOperationalCost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card space-y-4">
                <h3 className="section-title">Cost Logs (ledger totals)</h3>
                <div className="space-y-2">
                  {costData.map((d) => (
                    <div key={d.vehicleId} className="p-3 bg-slate-900/60 border border-slate-800 rounded text-xs space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{d.registrationNumber} — {d.name}</span>
                        <span className="text-amber-500">${d.totalOperationalCost.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-500">
                        <div>
                          <div className="font-semibold uppercase text-slate-550 flex items-center gap-0.5">
                            <Fuel size={10} />
                            Fuel
                          </div>
                          <div className="font-mono text-slate-300 mt-0.5">${d.fuelCost}</div>
                        </div>
                        <div>
                          <div className="font-semibold uppercase text-slate-550 flex items-center gap-0.5">
                            <Wrench size={10} />
                            Maint
                          </div>
                          <div className="font-mono text-slate-300 mt-0.5">${d.maintenanceCost}</div>
                        </div>
                        <div>
                          <div className="font-semibold uppercase text-slate-550 flex items-center gap-0.5">
                            <Landmark size={10} />
                            Other
                          </div>
                          <div className="font-mono text-slate-300 mt-0.5">${d.otherExpenses}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VEHICLE ROI */}
          {activeTab === 'roi' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card lg:col-span-2">
                <h3 className="section-title">Vehicle ROI Rating (%)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roiData}>
                      <XAxis dataKey="registrationNumber" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" %" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="roiPercent" radius={[4, 4, 0, 0]}>
                        {roiData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.roiPercent >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card space-y-4">
                <h3 className="section-title">Acquisition Return Audit</h3>
                <div className="space-y-2">
                  {roiData.map((d) => (
                    <div key={d.vehicleId} className="p-3 bg-slate-900/60 border border-slate-800 rounded text-xs space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{d.registrationNumber}</span>
                        <span className={`flex items-center gap-0.5 ${d.roiPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {d.roiPercent}%
                          <ArrowUpRight size={12} />
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-500">
                        <div className="flex justify-between">
                          <span>Acquisition Cost:</span>
                          <span className="font-mono text-slate-300">${d.acquisitionCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trip Revenue Logged:</span>
                          <span className="font-mono text-emerald-400">${d.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operating Expenses (Fuel + Maint):</span>
                          <span className="font-mono text-red-400">${(d.fuelCost + d.maintenanceCost).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
