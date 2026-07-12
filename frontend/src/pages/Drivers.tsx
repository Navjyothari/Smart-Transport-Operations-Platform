import { useState, useEffect } from 'react';
import api from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import RoleGate from '../components/RoleGate';
import { Plus, Edit2, Trash2, X, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: string;
  createdAt: string;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [licenseCat, setLicenseCat] = useState('');
  const [expiry, setExpiry] = useState('');
  const [contact, setContact] = useState('');
  const [safetyScore, setSafetyScore] = useState('100');

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/drivers');
      setDrivers(data);
    } catch (err: any) {
      toast.error('Failed to load drivers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setName('');
    setLicenseNo('');
    setLicenseCat('');
    setExpiry('');
    setContact('');
    setSafetyScore('100');
    setModalOpen(true);
  };

  const handleOpenEdit = (d: Driver) => {
    setEditingDriver(d);
    setName(d.name);
    setLicenseNo(d.licenseNumber);
    setLicenseCat(d.licenseCategory);
    // Format date string to YYYY-MM-DD
    const date = new Date(d.licenseExpiryDate);
    const dateString = date.toISOString().split('T')[0];
    setExpiry(dateString);
    setContact(d.contactNumber);
    setSafetyScore(d.safetyScore.toString());
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      licenseNumber: licenseNo,
      licenseCategory: licenseCat,
      licenseExpiryDate: expiry,
      contactNumber: contact,
      safetyScore: parseFloat(safetyScore),
    };

    try {
      if (editingDriver) {
        await api.patch(`/drivers/${editingDriver.id}`, payload);
        toast.success('Driver records updated!');
      } else {
        await api.post('/drivers', payload);
        toast.success('Driver registered successfully!');
      }
      setModalOpen(false);
      fetchDrivers();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Operation failed. Verify inputs.';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this driver?')) return;
    try {
      await api.delete(`/drivers/${id}`);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to remove driver');
    }
  };

  const getLicenseBadge = (expiryStr: string) => {
    const expiry = new Date(expiryStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return (
        <span className="badge bg-red-900/60 text-red-400 border border-red-700/50 flex items-center gap-1">
          <AlertTriangle size={12} />
          Expired
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span className="badge bg-amber-900/60 text-amber-400 border border-amber-700/50 flex items-center gap-1">
          <AlertTriangle size={12} />
          {diffDays} days left
        </span>
      );
    } else {
      return (
        <span className="badge bg-emerald-900/40 text-emerald-400 border border-emerald-700/30">
          Active ({diffDays}d)
        </span>
      );
    }
  };

  const handleExportCsv = () => {
    window.open('/api/reports/export.csv?type=drivers', '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Driver Directory</h2>
          <p className="text-sm text-slate-400 mt-1">Commercial driver licenses, contact information, real-time safety scores, and dispatcher flags</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCsv} className="btn btn-secondary flex items-center gap-2">
            <FileSpreadsheet size={16} />
            CSV Export
          </button>
          <RoleGate allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}>
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              Add Driver
            </button>
          </RoleGate>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : drivers.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">
          No drivers registered. Click 'Add Driver' to get started.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>License No</th>
                <th>Category</th>
                <th>License Status</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td className="font-semibold text-white">{d.name}</td>
                  <td className="font-mono">{d.licenseNumber}</td>
                  <td>{d.licenseCategory}</td>
                  <td>{getLicenseBadge(d.licenseExpiryDate)}</td>
                  <td>{d.contactNumber}</td>
                  <td>
                    <span
                      className={`font-semibold ${
                        d.safetyScore >= 90
                          ? 'text-emerald-400'
                          : d.safetyScore >= 75
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {d.safetyScore}/100
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <RoleGate allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}>
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="btn btn-ghost btn-sm text-blue-400 hover:text-blue-300"
                          title="Edit driver"
                        >
                          <Edit2 size={14} />
                        </button>
                      </RoleGate>
                      <RoleGate allowedRoles={['FLEET_MANAGER']}>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
                          title="Delete driver"
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
              {editingDriver ? `Edit Driver: ${editingDriver.name}` : 'Register New Driver'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value.toUpperCase())}
                    placeholder="DL-XXXXX"
                    className="input"
                    disabled={!!editingDriver}
                  />
                </div>
                <div className="form-group">
                  <label className="label">License Category</label>
                  <input
                    type="text"
                    required
                    value={licenseCat}
                    onChange={(e) => setLicenseCat(e.target.value)}
                    placeholder="HGV / LMV"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Safety Score (0-100)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91-XXXXX-XXXXX"
                  className="input"
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
                  Save Driver Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
