import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Gauge,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header / Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Truck size={20} />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-wide">TransitOps</span>
            </div>
          </div>
          <Link to="/login" className="btn btn-primary shadow-md">
            Log In <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6 uppercase tracking-wider">
          <Database size={12} /> Live Operational Dashboard
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Ditch the Logbooks.<br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Centralize Fleet Operations.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Say goodbye to fragmented spreadsheets and manual logbooks. TransitOps unifies vehicles, drivers, dispatch scheduling, maintenance logs, and operational expenses in one secure, automated system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login" className="btn btn-primary px-8 py-3.5 text-base shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
            Get Started (Log In) <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Metrics / Trust Strip */}
      <section className="border-y border-slate-900 bg-slate-900/30 backdrop-blur-sm py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Gauge size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-lg">Fleet Utilization</div>
              <div className="text-xs text-slate-400">Tracked in real time with distance analytics</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-lg">Auto Rule Enforcement</div>
              <div className="text-xs text-slate-400">Prisma transactions safeguard all dispatch actions</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-lg">Zero Double-Booking</div>
              <div className="text-xs text-slate-400">Automatic exclusion of vehicles & busy drivers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">The Real Costs of Manual Fleet Tracking</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Traditional spreadsheets and paper logbooks create massive operational blind spots that cost money.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Schedule Conflicts
            </div>
            <p className="text-sm text-slate-400">
              Assigning vehicles already in-shop or drivers already on-trip causes delays and operational friction.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Expired Licenses
            </div>
            <p className="text-sm text-slate-400">
              Drivers operating with expired licenses create massive regulatory compliance risks when unmonitored.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Hidden Operational Losses
            </div>
            <p className="text-sm text-slate-400">
              Inaccurate expense tracking and unlinked fuel logs make calculating accurate vehicle ROI impossible.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Features Engineered for Reliability</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A comprehensive suite of modules designed to handle all aspects of fleet operations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5">
              <Truck size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Vehicle Registry</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track vehicle status, acquisition costs, load capacity limits, and real-time odometer readings.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Driver Management</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monitor availability, license registration, and get automated expiration warnings.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5">
              <Route size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Trip Lifecycle</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dispatch drafts, complete routes, or cancel trips with strict transaction-backed business logic.
            </p>
          </div>
          {/* Card 4 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5">
              <Wrench size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Maintenance Workflow</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track open and closed maintenance tasks. Vehicles automatically report as "In Shop" during repairs.
            </p>
          </div>
          {/* Card 5 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5">
              <Fuel size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fuel & Expense Tracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Maintain an active ledger of fuel fills and trip expenses categorized for direct cost calculation.
            </p>
          </div>
          {/* Card 6 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dashboard & Reports</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Review fleet utilization, efficiency metrics, and vehicle ROI reports with instant CSV spreadsheet export.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Unified Operations for Every Role</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            TransitOps provides structured, role-based workflows for your entire team.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
            <div className="font-bold text-white text-base mb-2">Fleet Manager</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains full control. Oversees active vehicle registries, driver availability lists, and dispatches trips.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
            <div className="font-bold text-white text-base mb-2">Driver</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updates operational status. Logs refueling liters and views active trip details in real time.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
            <div className="font-bold text-white text-base mb-2">Safety Officer</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces fleet compliance. Reviews driver licenses and schedules maintenance events.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6">
            <div className="font-bold text-white text-base mb-2">Financial Analyst</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors operating costs. Records vehicle ledger expenses and reviews ROI reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900/30 border-t border-slate-900 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Optimize Your Fleet Operations?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Log in now to access the TransitOps portal.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn btn-primary px-8 py-3.5 shadow-xl shadow-blue-500/20">
              Log In to Portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-1.5 rounded text-slate-400 border border-slate-800">
              <Truck size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-300">TransitOps</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TransitOps Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
