interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  // Vehicle statuses
  AVAILABLE: { label: 'Available', color: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50' },
  ON_TRIP: { label: 'On Trip', color: 'bg-blue-900/60 text-blue-400 border border-blue-700/50' },
  IN_SHOP: { label: 'In Shop', color: 'bg-amber-900/60 text-amber-400 border border-amber-700/50' },
  RETIRED: { label: 'Retired', color: 'bg-slate-700/60 text-slate-400 border border-slate-600/50' },
  // Driver statuses
  OFF_DUTY: { label: 'Off Duty', color: 'bg-slate-700/60 text-slate-400 border border-slate-600/50' },
  SUSPENDED: { label: 'Suspended', color: 'bg-red-900/60 text-red-400 border border-red-700/50' },
  // Trip statuses
  DRAFT: { label: 'Draft', color: 'bg-slate-700/60 text-slate-400 border border-slate-600/50' },
  DISPATCHED: { label: 'Dispatched', color: 'bg-blue-900/60 text-blue-400 border border-blue-700/50' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-900/60 text-red-400 border border-red-700/50' },
  // Maintenance statuses
  ACTIVE: { label: 'Active', color: 'bg-amber-900/60 text-amber-400 border border-amber-700/50' },
  CLOSED: { label: 'Closed', color: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50' },
  // Driver request statuses
  PENDING: { label: 'Pending', color: 'bg-amber-900/60 text-amber-400 border border-amber-700/50' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50' },
  REJECTED: { label: 'Rejected', color: 'bg-red-900/60 text-red-400 border border-red-700/50' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, color: 'bg-slate-700 text-slate-300' };
  return (
    <span className={`badge ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {config.label}
    </span>
  );
}
