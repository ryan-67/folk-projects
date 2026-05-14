import { Brain } from 'lucide-react';
import type { BrainMemory } from '../hooks/useProjectStore';

interface Props {
  memories: BrainMemory[];
}

export default function BrainLinks({ memories }: Props) {
  if (!memories.length) return null;
  return (
    <div className="rail-section">
      <div className="panel-header"><Brain size={14} /> Folk Remembers</div>
      <div className="brain-list">
        {memories.map(m => (
          <div key={m.id} className="brain-card">
            <div className="brain-source">{m.source}</div>
            <div className="brain-summary">{m.summary}</div>
            <div className="brain-time">{formatAgo(m.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatAgo(ts: string) {
  const hours = Math.max(1, Math.floor((Date.now() - new Date(ts).getTime()) / 3600000));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days/7)}w ago`;
}
