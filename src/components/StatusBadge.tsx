interface Props {
  lastActivityAt: string;
  todoCount: number;
  doneCount: number;
}

export default function StatusBadge({ lastActivityAt, todoCount, doneCount }: Props) {
  const hoursSince = (Date.now() - new Date(lastActivityAt).getTime()) / 3600000;
  const allDone = todoCount > 0 && todoCount === doneCount;
  const stalled = hoursSince > 168; // 7 days

  let label = 'Active';
  let color = 'rgb(var(--color-sage))';
  if (allDone) { label = 'Done'; color = 'rgb(59 130 246)'; }
  else if (stalled) { label = 'Stalled'; color = 'rgb(234 179 8)'; }
  else if (hoursSince > 24) { label = 'Waiting'; color = 'rgb(var(--color-ink) / var(--ink-soft-2))'; }

  return (
    <span className="status-badge" style={{ color, borderColor: color }}>
      {label}
    </span>
  );
}
