interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: 'Available', color: 'status-green' },
  ON_TRIP: { label: 'On Trip', color: 'status-blue' },
  IN_SHOP: { label: 'In Shop', color: 'status-amber' },
  RETIRED: { label: 'Retired', color: 'status-muted' },
  OFF_DUTY: { label: 'Off Duty', color: 'status-muted' },
  SUSPENDED: { label: 'Suspended', color: 'status-red' },
  DRAFT: { label: 'Draft', color: 'status-muted' },
  DISPATCHED: { label: 'Dispatched', color: 'status-blue' },
  COMPLETED: { label: 'Completed', color: 'status-green' },
  CANCELLED: { label: 'Cancelled', color: 'status-red' },
  ACTIVE: { label: 'Active', color: 'status-amber' },
  CLOSED: { label: 'Closed', color: 'status-green' },
  PENDING: { label: 'Pending', color: 'status-amber' },
  APPROVED: { label: 'Approved', color: 'status-green' },
  REJECTED: { label: 'Rejected', color: 'status-red' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, color: 'status-muted' };
  return (
    <span className={`badge status-badge ${config.color}`}>
      <span className="status-dot"></span>
      {config.label}
    </span>
  );
}