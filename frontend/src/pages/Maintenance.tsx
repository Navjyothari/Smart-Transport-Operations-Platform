import { useState, useEffect } from 'react';
import api from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import RoleGate from '../components/RoleGate';
import { Plus, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  status: string;
}

interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  cost: number;
  status: string;
  openedAt: string;
  closedAt: string | null;
  notes: string | null;
  vehicle: { registrationNumber: string; name: string };
}

export default function Maintenance() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Available vehicles list
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [type, setType] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/maintenance');
      setLogs(data);
    } catch (err: any) {
      toast.error('Failed to load maintenance logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      // Filter out RETIRED vehicles or IN_SHOP vehicles from creating new logs
      setVehicles(data.filter((v: Vehicle) => v.status !== 'RETIRED' && v.status !== 'IN_SHOP'));
    } catch (err) {
      toast.error('Failed to load vehicles list');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleOpenAdd = () => {
    fetchVehicles();
    setVehicleId('');
    setType('');
    setCost('');
    setNotes('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      vehicleId,
      type,
      cost: parseFloat(cost),
      notes,
    };

    try {
      await api.post('/maintenance', payload);
      toast.success('Maintenance log opened! Vehicle is now IN SHOP.');
      setModalOpen(false);
      fetchLogs();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create log');
    }
  };

  const handleCloseLog = async (id: string) => {
    if (!confirm('Are you sure you want to close this maintenance log? This will restore the vehicle status to AVAILABLE.')) return;
    try {
      await api.post(`/maintenance/${id}/close`);
      toast.success('Maintenance servicing closed! Vehicle status restored.');
      fetchLogs();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to close log');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Maintenance Center</h2>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            Open shop repairs, monitor diagnostic records, and log fleet service events
          </p>
        </div>
        <RoleGate allowedRoles={['FLEET_MANAGER']}>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} />
            Log Maintenance Run
          </button>
        </RoleGate>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">
          No maintenance log records registered.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Service Type</th>
                <th>Diagnostic Notes</th>
                <th>Servicing Cost</th>
                <th>Opened Date</th>
                <th>Closed Date</th>
                <th>Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="font-semibold text-white">{log.vehicle.name}</div>
                    <div className="font-mono text-xs text-blue-400">{log.vehicle.registrationNumber}</div>
                  </td>
                  <td className="font-semibold">{log.type}</td>
                  <td className="max-w-xs truncate" title={log.notes || ''}>
                    {log.notes || <span className="text-slate-600 italic">No notes</span>}
                  </td>
                  <td className="font-mono text-amber-500">${log.cost.toLocaleString()}</td>
                  <td>{new Date(log.openedAt).toLocaleDateString()}</td>
                  <td>{log.closedAt ? new Date(log.closedAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <StatusBadge status={log.status} />
                  </td>
                  <td>
                    <RoleGate allowedRoles={['FLEET_MANAGER']}>
                      {log.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCloseLog(log.id)}
                          className="btn btn-success btn-sm flex items-center gap-1"
                          title="Restore vehicle status"
                        >
                          <Check size={12} />
                          Close Servicing
                        </button>
                      )}
                    </RoleGate>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Log Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">Log Servicing Event</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">Select Vehicle</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  required
                  className="select"
                >
                  <option value="">Choose Vehicle (Excludes Retired/In Shop)</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} — {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">Maintenance Type / Category</label>
                <input
                  type="text"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. Engine Overhaul, Brake Pad Replacement"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Estimated Servicing Cost ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 1500"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Diagnostic Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe parts replaced or issues found..."
                  className="input min-h-[100px] py-2"
                />
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
                  Open Servicing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
