import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Apply() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !contactNumber || !licenseNumber || !licenseCategory || !licenseExpiryDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/driver-requests', {
        name,
        email,
        contactNumber,
        licenseNumber: licenseNumber.toUpperCase(),
        licenseCategory,
        licenseExpiryDate,
      });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to submit application. Please check details.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 relative overflow-hidden p-6">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-lg p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Thank you, <span className="text-white font-semibold">{name}</span>. Your driver application has been successfully logged. Our fleet manager and safety officers will review your credentials soon.
          </p>
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 mb-8 text-left space-y-2.5 text-xs font-mono text-slate-300">
            <div><span className="text-slate-500">License Number:</span> {licenseNumber.toUpperCase()}</div>
            <div><span className="text-slate-500">License Category:</span> {licenseCategory}</div>
            <div><span className="text-slate-500">Contact Number:</span> {contactNumber}</div>
            <div><span className="text-slate-500">Email Address:</span> {email}</div>
          </div>
          <Link to="/" className="btn btn-secondary inline-flex justify-center w-full py-2.5">
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 relative overflow-hidden py-12 px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/login" className="btn btn-ghost btn-sm p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">Join TransitOps</h2>
            <p className="text-xs text-slate-400 mt-0.5">Submit your commercial credentials for fleet approval</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samuel Jackson"
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samuel@example.com"
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="label">Contact Phone Number</label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91-XXXXX-XXXXX"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">License Number</label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. DL99283748291"
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="label">License Category</label>
              <input
                type="text"
                required
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                placeholder="HGV / LMV"
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">License Expiry Date</label>
            <input
              type="date"
              required
              value={licenseExpiryDate}
              onChange={(e) => setLicenseExpiryDate(e.target.value)}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary justify-center py-3 text-base mt-2 shadow-xl shadow-blue-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Submitting application...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={16} /> Submit Driver Application
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
