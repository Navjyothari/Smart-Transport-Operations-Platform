import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Invalid credentials. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <main className="auth-page">
      <Link to="/" className="auth-back"><ArrowLeft size={15} /> Home</Link>
      <section className="auth-card">
        <div className="auth-brand">
          <span><Truck size={24} /></span>
          <div>
            <strong>TransitOps PRO</strong>
            <small>Secure fleet workspace</small>
          </div>
        </div>

        <div className="auth-heading">
          <p>Welcome back</p>
          <h1>Sign in to manage operations.</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label" htmlFor="email-input">Email address</label>
            <div className="auth-input-icon">
              <Mail size={18} />
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@transitops.com"
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password-input">Password</label>
            <div className="auth-input-icon">
              <Lock size={18} />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="input"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link to="/apply" className="auth-link">Want to join as a driver? Apply now</Link>

        <div className="demo-box">
          <div className="demo-title"><ShieldCheck size={14} /> Demo accounts</div>
          <div className="demo-grid">
            <button onClick={() => handleAutofill('manager@transitops.com')} type="button"><strong>Manager</strong><span>manager@transitops.com</span></button>
            <button onClick={() => handleAutofill('driver@transitops.com')} type="button"><strong>Driver</strong><span>driver@transitops.com</span></button>
            <button onClick={() => handleAutofill('safety@transitops.com')} type="button"><strong>Safety</strong><span>safety@transitops.com</span></button>
            <button onClick={() => handleAutofill('finance@transitops.com')} type="button"><strong>Finance</strong><span>finance@transitops.com</span></button>
          </div>
        </div>
      </section>
    </main>
  );
}