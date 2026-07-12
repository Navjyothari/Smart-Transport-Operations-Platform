import { useState, useEffect } from 'react';
import api from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import RoleGate from '../components/RoleGate';
import { Plus, Edit2, Trash2, X, Eye, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacityKg: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
  region: string | null;
  createdAt: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  // Form states
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Van');
  const [capacity, setCapacity] = useState('');
  const [odometer, setOdometer] = useState('0');
  const [cost, setCost] = useState('');
  const [region, setRegion] = useState('North');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
    } catch (err: any) {
      toast.error('Failed to load vehicles list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setRegNo('');
    setName('');
    setType('Van');
    setCapacity('');
    setOdometer('0');
    setCost('');
    setRegion('North');
    setModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setRegNo(v.registrationNumber);
    setName(v.name);
    setType(v.type);
    setCapacity(v.maxLoadCapacityKg.toString());
    setOdometer(v.odometer.toString());
    setCost(v.acquisitionCost.toString());
    setRegion(v.region || 'North');
    setModalOpen(true);
  };

  const handleViewDetail = async (v: Vehicle) => {
    try {
      const { data } = await api.get(`/vehicles/${v.id}`);
      setSelectedVehicle(data);
      setDetailOpen(true);
    } catch (err) {
      toast.error('Failed to load vehicle details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      registrationNumber: regNo,
      name,
      type,
      maxLoadCapacityKg: parseFloat(capacity),
      odometer: parseFloat(odometer),
      acquisitionCost: parseFloat(cost),
      region,
    };

    try {
      if (editingVehicle) {
        await api.patch(`/vehicles/${editingVehicle.id}`, payload);
        toast.success('Vehicle updated successfully!');
      } else {
        await api.post('/vehicles', payload);
        toast.success('Vehicle registered successfully!');
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Operation failed. Verify inputs.';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle removed successfully');
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete vehicle');
    }
  };

  const handleExportCsv = () => {
    window.open('/api/reports/export.csv?type=vehicles', '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Vehicle Registry</h2>
          <p className="text-sm text-slate-400 mt-1">Total operational fleet vehicles, cargo volume specs, and active service statuses</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCsv} className="btn btn-secondary flex items-center gap-2">
            <FileSpreadsheet size={16} />
            CSV Export
          </button>
          <RoleGate allowedRoles={['FLEET_MANAGER']}>
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              Add Vehicle
            </button>
          </RoleGate>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">
          No vehicles registered. Click 'Add Vehicle' to get started.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Name / Model</th>
                <th>Type</th>
                <th>Max Capacity</th>
                <th>Odometer</th>
                <th>Region</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="font-mono font-bold text-blue-400">{v.registrationNumber}</td>
                  <td className="font-semibold">{v.name}</td>
                  <td>{v.type}</td>
                  <td>{v.maxLoadCapacityKg} kg</td>
                  <td className="font-mono">{v.odometer.toLocaleString()} km</td>
                  <td>{v.region || '—'}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(v)}
                        className="btn btn-ghost btn-sm text-slate-400 hover:text-white"
                        title="View Detailed Logs"
                      >
                        <Eye size={14} />
                      </button>
                      <RoleGate allowedRoles={['FLEET_MANAGER']}>
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="btn btn-ghost btn-sm text-blue-400 hover:text-blue-300"
                          title="Edit vehicle details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
                          title="Delete vehicle"
                        >
                          <Trash2 size={14} />
                        </button>
                      </RoleGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">
              {editingVehicle ? `Edit Vehicle: ${editingVehicle.registrationNumber}` : 'Register New Vehicle'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group col-span-1">
                  <label className="label">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    placeholder="e.g. VAN-05"
                    className="input"
                    disabled={!!editingVehicle}
                  />
                </div>
                <div className="form-group col-span-1">
                  <label className="label">Vehicle Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="select"
                  >
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Vehicle Model Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ford Transit Cargo"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="label">Max Load (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="500"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Odometer (km)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    placeholder="0"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Acquisition Cost</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="35000"
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Operating Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="select"
                >
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Logs Modal */}
      {detailOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setDetailOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-white">
                Detailed Operations: {selectedVehicle.name} ({selectedVehicle.registrationNumber})
              </h3>
              <StatusBadge status={selectedVehicle.status} />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 font-semibold uppercase">Acquisition Cost</div>
                <div className="text-base font-bold text-white font-mono">${selectedVehicle.acquisitionCost.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 font-semibold uppercase">Odometer</div>
                <div className="text-base font-bold text-white font-mono">{selectedVehicle.odometer.toLocaleString()} km</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 font-semibold uppercase">Max Payload</div>
                <div className="text-base font-bold text-white font-mono">{selectedVehicle.maxLoadCapacityKg} kg</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 font-semibold uppercase">Region</div>
                <div className="text-base font-bold text-white">{selectedVehicle.region || '—'}</div>
              </div>
            </div>

            {/* Sub-panels for history */}
            <div className="space-y-6">
              {/* Trip Logs */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Trip History (Last 5)</h4>
                {selectedVehicle.trips.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">No trips recorded for this vehicle</div>
                ) : (
                  <div className="table-wrapper">
                    <table className="table text-xs">
                      <thead>
                        <tr>
                          <th>Source</th>
                          <th>Destination</th>
                          <th>Cargo</th>
                          <th>Distance</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicle.trips.map((t: any) => (
                          <tr key={t.id}>
                            <td>{t.source}</td>
                            <td>{t.destination}</td>
                            <td>{t.cargoWeightKg} kg</td>
                            <td className="font-mono">{t.actualDistanceKm || t.plannedDistanceKm} km</td>
                            <td><StatusBadge status={t.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Maintenance Logs */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Maintenance History (Last 5)</h4>
                {selectedVehicle.maintenanceLogs.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">No maintenance servicing logs found</div>
                ) : (
                  <div className="table-wrapper">
                    <table className="table text-xs">
                      <thead>
                        <tr>
                          <th>Service Type</th>
                          <th>Cost</th>
                          <th>Date Opened</th>
                          <th>Status</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicle.maintenanceLogs.map((m: any) => (
                          <tr key={m.id}>
                            <td className="font-semibold text-slate-200">{m.type}</td>
                            <td className="font-mono text-amber-400">${m.cost}</td>
                            <td>{new Date(m.openedAt).toLocaleDateString()}</td>
                            <td><StatusBadge status={m.status} /></td>
                            <td className="truncate max-w-[200px]">{m.notes || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
