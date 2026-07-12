import { useState, useEffect } from 'react';
import api from '../lib/api';
import RoleGate from '../components/RoleGate';
import { X, Fuel, DollarSign, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
}

interface FuelLog {
  id: string;
  liters: number;
  cost: number;
  date: string;
  vehicle: { registrationNumber: string; name: string };
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes: string | null;
  vehicle: { registrationNumber: string; name: string };
}

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Available vehicles list
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Modal controls
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Fuel form states
  const [fuelVehicleId, setFuelVehicleId] = useState('');
  const [liters, setLiters] = useState('');
  const [fuelCost, setFuelCost] = useState('');

  // Expense form states
  const [expVehicleId, setExpVehicleId] = useState('');
  const [category, setCategory] = useState('TOLL');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const [fuelRes, expRes, vehRes] = await Promise.all([
        api.get('/fuel-logs'),
        api.get('/expenses'),
        api.get('/vehicles'),
      ]);
      setFuelLogs(fuelRes.data);
      setExpenses(expRes.data);
      setVehicles(vehRes.data);
    } catch (err) {
      toast.error('Failed to load operational logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      vehicleId: fuelVehicleId,
      liters: parseFloat(liters),
      cost: parseFloat(fuelCost),
    };

    try {
      await api.post('/fuel-logs', payload);
      toast.success('Fuel refueling log recorded!');
      setFuelModalOpen(false);
      fetchRecords();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to log refueling');
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      vehicleId: expVehicleId,
      category,
      amount: parseFloat(amount),
      notes,
    };

    try {
      await api.post('/expenses', payload);
      toast.success('Operational expense recorded!');
      setExpenseModalOpen(false);
      fetchRecords();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to log expense');
    }
  };

  const handleExportFuel = () => {
    window.open('/api/reports/export.csv?type=fuel-logs', '_blank');
  };

  const handleExportExpenses = () => {
    window.open('/api/reports/export.csv?type=expenses', '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Fuel & Expenses</h2>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            Refueling costs, general ledger expenses, and fleet maintenance bookkeeping
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleGate allowedRoles={['DRIVER', 'FLEET_MANAGER']}>
            <button onClick={() => { setFuelVehicleId(''); setLiters(''); setFuelCost(''); setFuelModalOpen(true); }} className="btn btn-primary flex items-center gap-1.5">
              <Fuel size={16} />
              Refuel Log
            </button>
          </RoleGate>
          <RoleGate allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}>
            <button onClick={() => { setExpVehicleId(''); setCategory('TOLL'); setAmount(''); setNotes(''); setExpenseModalOpen(true); }} className="btn btn-success flex items-center gap-1.5">
              <DollarSign size={16} />
              Record Expense
            </button>
          </RoleGate>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fuel Logs Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0 flex items-center gap-2">
                <Fuel size={18} className="text-blue-400" />
                Refueling Log History
              </h3>
              <button onClick={handleExportFuel} className="btn btn-ghost btn-sm text-xs flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer">
                <FileSpreadsheet size={12} />
                Export CSV
              </button>
            </div>
            {fuelLogs.length === 0 ? (
              <div className="text-slate-500 text-sm italic text-center py-8 bg-slate-900/40 rounded-lg">
                No refueling logs recorded yet
              </div>
            ) : (
              <div className="table-wrapper max-h-[450px] overflow-y-auto">
                <table className="table text-xs">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Liters</th>
                      <th>Refueling Cost</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className="font-semibold text-slate-200">{log.vehicle.name}</div>
                          <div className="font-mono text-[10px] text-blue-400">{log.vehicle.registrationNumber}</div>
                        </td>
                        <td>{log.liters} L</td>
                        <td className="font-mono font-bold text-slate-200">${log.cost}</td>
                        <td>{new Date(log.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-400" />
                Other Operating Expenses
              </h3>
              <button onClick={handleExportExpenses} className="btn btn-ghost btn-sm text-xs flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer">
                <FileSpreadsheet size={12} />
                Export CSV
              </button>
            </div>
            {expenses.length === 0 ? (
              <div className="text-slate-500 text-sm italic text-center py-8 bg-slate-900/40 rounded-lg">
                No general expenses recorded yet
              </div>
            ) : (
              <div className="table-wrapper max-h-[450px] overflow-y-auto">
                <table className="table text-xs">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>
                          <div className="font-semibold text-slate-200">{exp.vehicle.name}</div>
                          <div className="font-mono text-[10px] text-blue-400">{exp.vehicle.registrationNumber}</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            exp.category === 'TOLL'
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30'
                              : exp.category === 'MAINTENANCE'
                              ? 'bg-amber-900/30 text-amber-400 border border-amber-700/30'
                              : 'bg-slate-700/30 text-slate-300 border border-slate-600/30'
                          }`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="max-w-[150px] truncate" title={exp.notes || ''}>{exp.notes || '—'}</td>
                        <td className="font-mono font-bold text-emerald-400">${exp.amount}</td>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fuel Modal */}
      {fuelModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => setFuelModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">Log Fuel Refueling</h3>

            <form onSubmit={handleCreateFuel} className="space-y-4">
              <div className="form-group">
                <label className="label">Refueled Vehicle</label>
                <select value={fuelVehicleId} onChange={(e) => setFuelVehicleId(e.target.value)} required className="select">
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Fuel Liters (L)</label>
                  <input type="number" required min="0.1" step="0.01" value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="e.g. 50" className="input" />
                </div>
                <div className="form-group">
                  <label className="label">Refueling Cost ($)</label>
                  <input type="number" required min="1" step="0.01" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} placeholder="e.g. 6000" className="input" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setFuelModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Refueling</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => setExpenseModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">Log Fleet Expense</h3>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Select Vehicle</label>
                  <select value={expVehicleId} onChange={(e) => setExpVehicleId(e.target.value)} required className="select">
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Expense Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
                    <option value="TOLL">TOLL</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Expense Amount ($)</label>
                <input type="number" required min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 850" className="input" />
              </div>

              <div className="form-group">
                <label className="label">Expense Notes / Memo</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Mumbai Toll Plaza clearance" className="input" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setExpenseModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-success">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
