import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export default function KpiCard({ title, value, subtitle, icon, color = 'blue', trend }: KpiCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'kpi-blue',
    emerald: 'kpi-emerald',
    amber: 'kpi-amber',
    red: 'kpi-red',
    slate: 'kpi-slate',
    purple: 'kpi-blue',
  };

  return (
    <div className={`stat-card ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="kpi-icon">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.value >= 0 ? 'Up' : 'Down'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
    </div>
  );
}