import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import RoleGate from '../components/RoleGate';
import { Check, X, ShieldAlert, Calendar, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface DriverRequest {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  email: string;
  status: string;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export default function DriverRequests() {
  const [requests, setRequests] = useState<DriverRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  // Rejection Modal state
  const [rejectingRequest, setRejectingRequest] = useState<DriverRequest | null>(null);
  const [reason, setReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/driver-requests?status=${statusFilter}` : '/driver-requests';
      const { data } = await api.get(url);
      setRequests(data);
    } catch (err: any) {
      toast.error('Failed to load driver applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this applicant? Doing so will instantly register them as a driver.')) return;
    try {
      await api.post(`/driver-requests/${id}/approve`);
      toast.success('Application approved! Driver is now registered.');
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve application');
    }
  };

  const handleRejectClick = (req: DriverRequest) => {
    setReason('');
    setRejectingRequest(req);
  };

  const handleRejectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest) return;

    try {
      await api.post(`/driver-requests/${rejectingRequest.id}/reject`, {
        rejectionReason: reason,
      });
      toast.success('Application rejected.');
      setRejectingRequest(null);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject application');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Driver Applications</h2>
          <p className="text-sm text-slate-400 mt-1">Review self-requests from prospective commercial drivers</p>
        </div>
        
        {/* Status Filters */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {['PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          No {statusFilter.toLowerCase()} applications found.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>License No</th>
                <th>Category</th>
                <th>Expiry</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Applied On</th>
                {statusFilter === 'REJECTED' && <th>Rejection Reason</th>}
                {statusFilter === 'PENDING' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div>
                      <div className="font-semibold text-white">{r.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail size={12} className="text-slate-500" />
                        {r.email}
                      </div>
                    </div>
                  </td>
                  <td className="font-mono">{r.licenseNumber}</td>
                  <td>{r.licenseCategory}</td>
                  <td>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar size={13} className="text-slate-500" />
                      {new Date(r.licenseExpiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Phone size={13} className="text-slate-500" />
                      {r.contactNumber}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  {statusFilter === 'REJECTED' && (
                    <td className="text-red-400 text-xs italic max-w-xs truncate" title={r.rejectionReason || ''}>
                      {r.rejectionReason || 'No reason provided'}
                    </td>
                  )}
                  {statusFilter === 'PENDING' && (
                    <td>
                      <div className="flex items-center gap-1.5">
                        <RoleGate allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="btn btn-success btn-sm p-1.5 rounded-lg"
                            title="Approve applicant"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleRejectClick(r)}
                            className="btn btn-danger btn-sm p-1.5 rounded-lg"
                            title="Reject applicant"
                          >
                            <X size={14} />
                          </button>
                        </RoleGate>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection reason modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setRejectingRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={20} />
              Reject Application
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Rejecting application for <span className="text-white font-semibold">{rejectingRequest.name}</span>. Provide an optional reason to save with the record.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">Rejection Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. License category does not match requirements, or incorrect license details."
                  className="input min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
