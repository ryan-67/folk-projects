import { useEffect, useState, useRef } from 'react';
import { Command, Folder } from 'lucide-react';
import { Project } from './Sidebar';

interface Props {
  projects: Project[];
  activeId: string | null;
  onSelect: (project: Project) => void;
  onClose: () => void;
}

export default function CommandPalette({ projects, activeId, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette" onClick={e => e.stopPropagation()}>
        <div style={{ position: 'relative' }}>
          <Command size={16} style={{ position: 'absolute', left: 18, top: 18, color: '#5a5a6a', pointerEvents: 'none' }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Switch project..." style={{ paddingLeft: 44 }} />
        </div>
        <div className="palette-list">
          {filtered.map(p => (
            <div key={p.id} className={`palette-item ${p.id === activeId ? 'active' : ''}`} onClick={() => { onSelect(p); onClose(); }}>
              <Folder size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
              <div className="project-avatar" style={{ width: 22, height: 22, backgroundColor: p.color, fontSize: 10, borderRadius: 6 }}>
                {p.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <span>{p.name}</span>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#5a5a6a', padding: 20, fontSize: 13 }}>No projects found</div>}
        </div>
      </div>
    </div>
  );
}
