import { CheckSquare, Link2, FileText, MessageSquare, Sparkles } from 'lucide-react';
import type { ActivityItem } from '../hooks/useProjectStore';

interface Props {
  activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: Props) {
  if (!activities.length) return <div className="brief-empty">No activity yet</div>;
  const sorted = [...activities].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 12);

  return (
    <div className="timeline-list">
      {sorted.map(a => (
        <div key={a.id} className="timeline-item">
          <div className={`timeline-icon ${a.type}`}>{iconFor(a.type)}</div>
          <div className="timeline-body">
            <div className="timeline-text">{a.folkGenerated ? <span style={{ color: 'rgb(var(--color-sage))', fontWeight:500 }}>folk&nbsp;</span> : ''}{a.text}</div>
            <div className="timeline-time">{formatTime(a.timestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function iconFor(type: string) {
  switch (type) {
    case 'todo': return <CheckSquare size={12} />;
    case 'link': return <Link2 size={12} />;
    case 'note': return <FileText size={12} />;
    case 'chat': return <MessageSquare size={12} />;
    case 'suggest': return <Sparkles size={12} />;
    default: return <Sparkles size={12} />;
  }
}

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = (+now - +d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
