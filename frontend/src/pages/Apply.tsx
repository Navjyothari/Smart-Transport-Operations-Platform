import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Send, UserPlus } from 'lucide-react';
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
      <main className="auth-page">
        <section className="auth-card success-card">
          <div className="success-icon"><CheckCircle2 size={48} /></div>
          <div className="auth-heading centered">
            <p>Application submitted</p>
            <h1>Thanks, {name}.</h1>
          </div>
          <p className="success-copy">
            Your driver application is now in the review queue. Fleet managers and safety officers will verify your license details before approval.
          </p>
          <div className="summary-box">
            <div><span>License</span><strong>{licenseNumber.toUpperCase()}</strong></div>
            <div><span>Category</span><strong>{licenseCategory}</strong></div>
            <div><span>Contact</span><strong>{contactNumber}</strong></div>
            <div><span>Email</span><strong>{email}</strong></div>
          </div>
          <Link to="/" className="btn btn-secondary auth-submit"><ArrowLeft size={16} /> Return home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <Link to="/login" className="auth-back"><ArrowLeft size={15} /> Sign in</Link>
      <section className="auth-card auth-card-wide">
        <div className="auth-brand">
          <span><UserPlus size={24} /></span>
          <div>
            <strong>Driver Application</strong>
            <small>Join the TransitOps dispatch pool</small>
          </div>
        </div>

        <div className="auth-heading">
          <p>Commercial driver request</p>
          <h1>Submit your credentials for approval.</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">Full name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Samuel Jackson" className="input" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="samuel@example.com" className="input" />
            </div>
            <div className="form-group">
              <label className="label">Contact phone</label>
              <input type="text" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+91-XXXXX-XXXXX" className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">License number</label>
              <input type="text" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="e.g. DL99283748291" className="input" />
            </div>
            <div className="form-group">
              <label className="label">License category</label>
              <input type="text" required value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)} placeholder="HGV / LMV" className="input" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">License expiry date</label>
            <input type="date" required value={licenseExpiryDate} onChange={(e) => setLicenseExpiryDate(e.target.value)} className="input" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
            {loading ? 'Submitting...' : <><Send size={16} /> Submit application</>}
          </button>
        </form>
      </section>
    </main>
  );
}