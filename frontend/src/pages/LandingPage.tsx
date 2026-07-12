import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Fuel,
  Gauge,
  Search,
  ShieldCheck,
  Truck,
  UserPlus,
  Users,
  Wrench,
} from 'lucide-react';
import heroImage from '../assets/hero-vehicles.png';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const modules = [
    { icon: <Truck size={20} />, title: 'Vehicle Control', text: 'Track registrations, payload limits, odometers, and availability.' },
    { icon: <Users size={20} />, title: 'Driver Readiness', text: 'Review licenses, safety scores, and duty status before dispatch.' },
    { icon: <Gauge size={20} />, title: 'Trip Operations', text: 'Plan routes, dispatch runs, and complete trips with live state checks.' },
    { icon: <Wrench size={20} />, title: 'Maintenance Flow', text: 'Open service logs and keep in-shop vehicles out of dispatch.' },
  ];

  return (
    <main className="landing-page">
      <section className="landing-frame">
        <header className="landing-nav">
          <Link to="/" className="landing-brand">
            <span><Truck size={20} /></span>
            TransitOps PRO
          </Link>
          <nav aria-label="Landing navigation">
            <a href="#platform">Platform</a>
            <a href="#modules">Operations</a>
            <a href="#security">Compliance</a>
          </nav>
          <div className="landing-actions">
            <button type="button" aria-label="Search"><Search size={20} /></button>
            <Link to="/login">Sign in</Link>
          </div>
        </header>

        <div className="landing-hero" id="platform">
          <div className="landing-copy">
            <p className="landing-kicker">Smart transport operations</p>
            <h1>Fleet control without the paperwork.</h1>
            <p>
              Manage vehicles, drivers, trips, maintenance, fuel, expenses, and reports from one polished operations workspace.
            </p>
            <div className="landing-cta-row">
              <Link to="/login" className="landing-primary">Get started</Link>
              <Link to="/apply" className="landing-secondary"><UserPlus size={17} /> Apply as driver</Link>
            </div>
          </div>

          <div className="landing-visual" aria-hidden="true">
            <span className="sunburst"></span>
            <span className="road-line"></span>
            <img src={heroImage} alt="" />
            <div className="vehicle-card vehicle-card-left">
              <Truck size={17} /> 24 active units
            </div>
            <div className="vehicle-card vehicle-card-right">
              <CheckCircle2 size={17} /> Dispatch ready
            </div>
          </div>
        </div>

        <section className="landing-panel" id="modules">
          <div className="landing-pills" aria-label="Platform highlights">
            <span className="active">Fleet</span>
            <span>Drivers</span>
            <span>Trips</span>
            <span>Reports</span>
          </div>

          <article className="yellow-card">
            <a href="#security">Learn more</a>
            <h2>Unified operations hub</h2>
            <p>One workspace for planning, checking, dispatching, and auditing every run.</p>
          </article>

          <article className="calc-card" id="security">
            <div>
              <span>Operations rules</span>
              <strong>Dispatch guardrails</strong>
            </div>
            <div className="mini-sun"></div>
            <p>Expired licenses, unavailable drivers, in-shop vehicles, and overloaded cargo are blocked before dispatch.</p>
          </article>

          <article className="metric-card">
            <ArrowRight size={30} />
            <span>Live dashboard</span>
            <strong>600+</strong>
            <p>records ready for review across fleet, trips, costs, and ROI.</p>
          </article>
        </section>
      </section>

      <section className="landing-modules">
        <div className="landing-section-heading">
          <p>Built for daily fleet work</p>
          <h2>Every page follows the same calm, fast operations language.</h2>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <article key={module.title}>
              <span>{module.icon}</span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-strip">
        <div>
          <ShieldCheck size={22} /> Role-based access
        </div>
        <div>
          <ClipboardCheck size={22} /> Driver applications
        </div>
        <div>
          <Fuel size={22} /> Cost tracking
        </div>
        <div>
          <BarChart3 size={22} /> Analytics export
        </div>
      </section>
    </main>
  );
}