import { Calendar, CheckSquare, ArrowUpRight } from 'lucide-react';
import type { CrossSurfaceItem } from '../hooks/useProjectStore';

interface Props {
  items: CrossSurfaceItem[];
}

export default function UpcomingPanel({ items }: Props) {
  const errands = items.filter(i => i.type === 'errand');
  const scheduled = items.filter(i => i.type === 'scheduled');
  if (!errands.length && !scheduled.length) return null;

  return (
    <div className="rail-section">
      <div className="panel-header">
        <ArrowUpRight size={14} /> Surface Links
      </div>
      {scheduled.length > 0 && (
        <div className="surface-group">
          <div className="surface-label"><Calendar size={12} /> Scheduled</div>
          {scheduled.map(s => (
            <div key={s.id} className="surface-item">
              <span className="surface-text">{s.text}</span>
              {s.due && <span className="surface-due">{formatDate(s.due)}</span>}
            </div>
          ))}
        </div>
      )}
      {errands.length > 0 && (
        <div className="surface-group">
          <div className="surface-label"><CheckSquare size={12} /> Errands</div>
          {errands.map(e => (
            <div key={e.id} className="surface-item">
              <span className="surface-text">{e.text}</span>
              {e.due && <span className="surface-due">{formatDate(e.due)}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
