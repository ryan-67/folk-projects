import { useState, useEffect, useRef, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Project } from './Sidebar';

interface SearchResult {
  project: Project;
  type: 'note' | 'todo' | 'link';
  text: string;
  snippet: string;
}

interface Props {
  projects: Project[];
  onSelect: (project: Project) => void;
  onClose: () => void;
}

export default function SearchModal({ projects, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out: SearchResult[] = [];
    for (const p of projects) {
      const raw = localStorage.getItem(`folk_projects_data_${p.id}`);
      if (!raw) continue;
      let d: any;
      try { d = JSON.parse(raw); } catch { continue; }
      if (d.notes && d.notes.toLowerCase().includes(q)) {
        const idx = d.notes.toLowerCase().indexOf(q);
        out.push({ project: p, type: 'note', text: 'Notes', snippet: d.notes.slice(Math.max(0, idx - 30), idx + 80) });
      }
      for (const t of (d.todos || [])) {
        if (t.text && t.text.toLowerCase().includes(q)) {
          out.push({ project: p, type: 'todo', text: t.text, snippet: t.text });
        }
      }
      for (const l of (d.links || [])) {
        if (l.title && l.title.toLowerCase().includes(q)) {
          out.push({ project: p, type: 'link', text: l.title, snippet: l.url || l.title });
        }
      }
    }
    return out.slice(0, 20);
  }, [query, projects]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 18, top: 18, color: '#5a5a6a', pointerEvents: 'none' }} />
          <input ref={inputRef} className="search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search across all projects..." style={{ paddingLeft: 44 }} />
        </div>
        <div className="search-results">
          {results.map((r, i) => (
            <div key={i} className="search-result" onClick={() => { onSelect(r.project); onClose(); }}>
              <div className="search-result-type">{r.type} &middot; {r.project.name}</div>
              <div className="search-result-snippet">{r.snippet}</div>
            </div>
          ))}
          {query.trim() && results.length === 0 && <div className="search-empty">No results found</div>}
        </div>
      </div>
    </div>
  );
}
