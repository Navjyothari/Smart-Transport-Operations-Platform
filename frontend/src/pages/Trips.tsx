import { useState, useEffect } from 'react';
import api from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import RoleGate from '../components/RoleGate';
import { Plus, X, Play, Check, Ban, AlertCircle, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  maxLoadCapacityKg: number;
  status: string;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: string;
}

interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  actualDistanceKm: number | null;
  fuelConsumedL: number | null;
  revenue: number;
  status: string;
  dispatchedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  vehicle: { registrationNumber: string; name: string };
  driver: { name: string; licenseNumber: string };
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Available lists for picker (query param availableForDispatch=true)
  const [availVehicles, setAvailVehicles] = useState<Vehicle[]>([]);
  const [availDrivers, setAvailDrivers] = useState<Driver[]>([]);

  // Trip form states
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');
  const [revenue, setRevenue] = useState('');

  // Complete form states
  const [actualDistance, setActualDistance] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [tripRevenue, setTripRevenue] = useState('');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
    } catch (err: any) {
      toast.error('Failed to load trips logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEntities = async () => {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        api.get('/vehicles?availableForDispatch=true'),
        api.get('/drivers?availableForDispatch=true'),
      ]);
      setAvailVehicles(vehiclesRes.data);
      setAvailDrivers(driversRes.data);
    } catch (err) {
      toast.error('Failed to load dispatch pool resources');
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleOpenCreate = () => {
    fetchAvailableEntities();
    setSource('');
    setDestination('');
    setVehicleId('');
    setDriverId('');
    setCargoWeight('');
    setPlannedDistance('');
    setRevenue('');
    setModalOpen(true);
  };

  const selectedVehicleObj = availVehicles.find((v) => v.id === vehicleId);
  const selectedDriverObj = availDrivers.find((d) => d.id === driverId);

  // Checks for UI alerts
  const isWeightOverload =
    selectedVehicleObj &&
    cargoWeight &&
    parseFloat(cargoWeight) > selectedVehicleObj.maxLoadCapacityKg;

  const isDriverLicenseExpired =
    selectedDriverObj && new Date(selectedDriverObj.licenseExpiryDate) < new Date();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isWeightOverload) {
      toast.error('Cannot create trip: Cargo weight exceeds vehicle limit');
      return;
    }

    const payload = {
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeightKg: parseFloat(cargoWeight),
      plannedDistanceKm: parseFloat(plannedDistance),
      revenue: revenue ? parseFloat(revenue) : 0,
    };

    try {
      await api.post('/trips', payload);
      toast.success('Trip draft created successfully!');
      setModalOpen(false);
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create trip');
    }
  };

  const handleDispatch = async (id: string) => {
    try {
      await api.post(`/trips/${id}/dispatch`);
      toast.success('Trip dispatched! Vehicle and driver are now ON TRIP.');
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Dispatch check failed');
    }
  };

  const handleOpenComplete = (trip: Trip) => {
    setSelectedTrip(trip);
    setActualDistance(trip.plannedDistanceKm.toString());
    setFuelConsumed('');
    setTripRevenue(trip.revenue.toString());
    setCompleteModalOpen(true);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;

    const payload = {
      actualDistanceKm: parseFloat(actualDistance),
      fuelConsumedL: parseFloat(fuelConsumed),
      revenue: parseFloat(tripRevenue),
    };

    try {
      await api.post(`/trips/${selectedTrip.id}/complete`, payload);
      toast.success('Trip marked COMPLETED. Odometer updated!');
      setCompleteModalOpen(false);
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Complete failed');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await api.post(`/trips/${id}/cancel`);
      toast.success('Trip cancelled and vehicle status restored');
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Cancellation failed');
    }
  };

  const handleExportCsv = () => {
    window.open('/api/reports/export.csv?type=trips', '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Trip Planner</h2>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch workflows, cargo capacity gates, and trip logs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCsv} className="btn btn-secondary flex items-center gap-2">
            <FileSpreadsheet size={16} />
            CSV Export
          </button>
          <RoleGate allowedRoles={['FLEET_MANAGER', 'DRIVER']}>
            <button onClick={handleOpenCreate} className="btn btn-primary">
              <Plus size={16} />
              Plan New Trip
            </button>
          </RoleGate>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : trips.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">
          No planned trips found. Plan a trip draft to begin operations.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Routing</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo Weight</th>
                <th>Planned Dist</th>
                <th>Actual Dist</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="font-semibold text-slate-200">
                      {t.source} → {t.destination}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      ID: {t.id.substring(0, 8)} | Created: {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="font-semibold text-blue-400 font-mono">
                    {t.vehicle.registrationNumber}
                  </td>
                  <td>{t.driver.name}</td>
                  <td>{t.cargoWeightKg} kg</td>
                  <td>{t.plannedDistanceKm} km</td>
                  <td className="font-mono">{t.actualDistanceKm ? `${t.actualDistanceKm} km` : '—'}</td>
                  <td className="font-mono text-emerald-400">${t.revenue.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <RoleGate allowedRoles={['FLEET_MANAGER', 'DRIVER']}>
                        {t.status === 'DRAFT' && (
                          <>
                            <button
                              onClick={() => handleDispatch(t.id)}
                              className="btn btn-success btn-sm flex items-center gap-1"
                              title="Verify rules and dispatch"
                            >
                              <Play size={12} />
                              Dispatch
                            </button>
                            <button
                              onClick={() => handleCancel(t.id)}
                              className="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
                              title="Cancel draft"
                            >
                              <Ban size={12} />
                            </button>
                          </>
                        )}
                        {t.status === 'DISPATCHED' && (
                          <>
                            <button
                              onClick={() => handleOpenComplete(t)}
                              className="btn btn-primary btn-sm flex items-center gap-1"
                              title="Mark as completed"
                            >
                              <Check size={12} />
                              Complete
                            </button>
                            <button
                              onClick={() => handleCancel(t.id)}
                              className="btn btn-danger btn-sm flex items-center gap-1"
                              title="Cancel and restore pool"
                            >
                              <Ban size={12} />
                              Cancel
                            </button>
                          </>
                        )}
                      </RoleGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Plan Trip Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">Plan Trip Route</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Origin / Source</label>
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Mumbai Hub"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Destination</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Pune Depot"
                    className="input"
                  />
                </div>
              </div>

              {/* Resource Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Assigned Vehicle</label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    required
                    className="select"
                  >
                    <option value="">Select Available Vehicle</option>
                    {availVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} — {v.name} (Max: {v.maxLoadCapacityKg}kg)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Assigned Driver</label>
                  <select
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    required
                    className="select"
                  >
                    <option value="">Select Available Driver</option>
                    {availDrivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — CDL: {d.licenseNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Overload live Capacity warning banner (Quick Win) */}
              {isWeightOverload && (
                <div className="bg-red-950/60 border border-red-800 text-red-300 rounded-lg p-3.5 flex items-start gap-2.5 animate-bounce">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold">Overloaded Cargo warning:</span> The cargo weight ({cargoWeight}kg) exceeds vehicle capacity ({selectedVehicleObj.maxLoadCapacityKg}kg). Dispatch will fail.
                  </div>
                </div>
              )}

              {isDriverLicenseExpired && (
                <div className="bg-red-950/60 border border-red-800 text-red-300 rounded-lg p-3.5 flex items-start gap-2.5">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold">Expired commercial license:</span> The driver license is expired. Operations rules will reject dispatch.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="label">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(e.target.value)}
                    placeholder="e.g. 450"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Distance (km)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={plannedDistance}
                    onChange={(e) => setPlannedDistance(e.target.value)}
                    placeholder="e.g. 150"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Revenue ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="e.g. 18000"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!!isWeightOverload}>
                  Create Trip Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {completeModalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setCompleteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">Complete Trip</h3>

            <form onSubmit={handleComplete} className="space-y-4">
              <div className="form-group">
                <label className="label">Actual Distance Traveled (km)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={actualDistance}
                  onChange={(e) => setActualDistance(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Total Fuel Consumed (Liters)</label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.01"
                  value={fuelConsumed}
                  onChange={(e) => setFuelConsumed(e.target.value)}
                  placeholder="e.g. 42.5"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Billed Trip Revenue ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={tripRevenue}
                  onChange={(e) => setTripRevenue(e.target.value)}
                  className="input"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Complete Trip Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
