interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export default function KpiCard({ title, value, subtitle, icon, color = 'blue', trend }: KpiCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-600/20 to-blue-800/10 border-blue-700/30',
    emerald: 'from-emerald-600/20 to-emerald-800/10 border-emerald-700/30',
    amber: 'from-amber-600/20 to-amber-800/10 border-amber-700/30',
    red: 'from-red-600/20 to-red-800/10 border-red-700/30',
    slate: 'from-slate-600/20 to-slate-800/10 border-slate-700/30',
    purple: 'from-purple-600/20 to-purple-800/10 border-purple-700/30',
  };

  const iconColorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    red: 'text-red-400 bg-red-500/20',
    slate: 'text-slate-400 bg-slate-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
  };

  return (
    <div className={`stat-card bg-gradient-to-br ${colorMap[color] || colorMap.blue} hover:scale-[1.02] transition-transform`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${iconColorMap[color] || iconColorMap.blue}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
    </div>
  );
}
