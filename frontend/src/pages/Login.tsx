import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, Mail, Eye, EyeOff } from 'lucide-react';
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
      navigate('/');
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
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background gradients for aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/20">
            <Truck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to TransitOps</h2>
          <p className="text-sm text-slate-400 mt-1.5 text-center">
            Fleet management, operations, and ROI analytics portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="label" htmlFor="email-input">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail size={18} />
              </span>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@transitops.com"
                className="input pl-10"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password-input">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock size={18} />
              </span>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary justify-center py-3 text-base mt-2 shadow-xl shadow-blue-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials Quick-Links */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 text-center">
            Demo Autofill Accounts (pw: password123)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAutofill('manager@transitops.com')}
              className="text-left px-3 py-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-300">Manager</div>
              <div className="text-[10px] text-slate-500 truncate">manager@transitops.com</div>
            </button>
            <button
              onClick={() => handleAutofill('driver@transitops.com')}
              className="text-left px-3 py-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-300">Driver</div>
              <div className="text-[10px] text-slate-500 truncate">driver@transitops.com</div>
            </button>
            <button
              onClick={() => handleAutofill('safety@transitops.com')}
              className="text-left px-3 py-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-300">Safety</div>
              <div className="text-[10px] text-slate-500 truncate">safety@transitops.com</div>
            </button>
            <button
              onClick={() => handleAutofill('finance@transitops.com')}
              className="text-left px-3 py-2 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-300">Finance</div>
              <div className="text-[10px] text-slate-500 truncate">finance@transitops.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
