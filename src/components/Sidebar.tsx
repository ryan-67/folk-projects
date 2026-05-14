import { Plus, Command, GripVertical } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface Project {
  id: string;
  name: string;
  url?: string;
  avatar?: string;
  color?: string;
  template?: string;
}

interface Props {
  projects: Project[];
  activeId: string | null;
  onSelect: (p: Project) => void;
  onOpenPalette: () => void;
  onAddProject: () => void;
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// Mock lastActivity for demo since Sidebar doesn't have access to full store
function mockLastActivity(id: string) {
  const map: Record<string, number> = {
    folk_projects: 2,
    job_search: 26,
    geonbu_v3: 120,
    kalshi_trading: 6,
    youtube_channel: 300,
  };
  const hours = map[id] || 6;
  return new Date(Date.now() - hours * 3600000).toISOString();
}
function mockCounts(id: string) {
  const map: Record<string, [number,number]> = {
    folk_projects: [4, 1],
    job_search: [8, 2],
    geonbu_v3: [6, 3],
    kalshi_trading: [3, 0],
    youtube_channel: [5, 5],
  };
  return map[id] || [4,1];
}

export default function Sidebar({ projects, activeId, onSelect, onOpenPalette, onAddProject }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h2>Projects <span style={{fontSize:11,fontWeight:400,opacity:0.5,marginLeft:6}}>({projects.length})</span></h2>
        <button className="icon-btn" onClick={onOpenPalette} title="Switch project (Cmd K)">
          <Command size={14} />
        </button>
      </div>
      <ul className="project-list">
        {projects.map(p => {
          const [tc, dc] = mockCounts(p.id);
          return (
            <li key={p.id} className={`project-row ${activeId === p.id ? 'active' : ''}`} onClick={() => onSelect(p)}>
              <GripVertical size={14} className="drag-handle" style={{ color: 'rgb(var(--color-ink) / var(--ink-soft-4))', flexShrink:0 }} />
              <div className="project-avatar" style={{ background: p.color || '#6366f1' }}>{initials(p.name)}</div>
              <div style={{ flex: 1, minWidth:0 }}>
                <div style={{ fontWeight: 500, fontSize: 13.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                  <StatusBadge lastActivityAt={mockLastActivity(p.id)} todoCount={tc} doneCount={dc} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <button className="add-project-btn" onClick={onAddProject}>
        <Plus size={14} /> New project
      </button>
    </aside>
  );
}
