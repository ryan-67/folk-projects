import { useState, useEffect, useCallback } from 'react';
import { Search, Sun, Moon, Keyboard } from 'lucide-react';
import Sidebar, { Project } from './components/Sidebar';
import Workspace from './components/Workspace';
import CommandPalette from './components/CommandPalette';
import SearchModal from './components/SearchModal';
import HelpModal from './components/HelpModal';
import AddProjectModal from './components/AddProjectModal';
import seedProjects from './data/projects.json';
import { seedDemoData } from './hooks/useProjectStore';
import './App.css';

function loadProjects(): Project[] {
  seedDemoData(seedProjects as Project[]);
  try {
    const raw = localStorage.getItem('folk_projects_list');
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedProjects as Project[];
}

function App() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [active, setActive] = useState<Project | null>(projects[0] || null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('folk_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('folk_projects_list', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('folk_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const addProject = useCallback((p: Project) => {
    setProjects(prev => [...prev, p]);
    setActive(p);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k' && !e.shiftKey) {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (meta && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setAddOpen(true);
      }
      if (meta && e.key === '/') {
        e.preventDefault();
        setHelpOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false);
        setSearchOpen(false);
        setHelpOpen(false);
        setAddOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-pill">folk</div>
          <nav className="topbar-nav">
            <span className="nav-pill">Errands</span>
            <span className="nav-pill">Scheduled</span>
            <span className="nav-pill active">Projects</span>
            <span className="nav-pill">Settings</span>
          </nav>
        </div>
        <div className="topbar-right">
          <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Search">
            <Search size={16} strokeWidth={1.5} />
          </button>
          <button className="icon-btn" onClick={() => setIsDark(d => !d)} title="Toggle theme">
            {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
          </button>
          <button className="icon-btn" onClick={() => setHelpOpen(true)} title="Shortcuts">
            <Keyboard size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="body">
        <Sidebar
          projects={projects}
          onSelect={setActive}
          activeId={active?.id || null}
          onOpenPalette={() => setPaletteOpen(true)}
          onAddProject={() => setAddOpen(true)}
        />
        <div className="main">
          {active ? (
            <Workspace key={active.id} project={active} />
          ) : (
            <div className="empty">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p>Select a project to get started</p>
              <span className="empty-hint">or press <kbd>Cmd K</kbd> to switch</span>
            </div>
          )}
        </div>
      </div>
      {paletteOpen && (
        <CommandPalette
          projects={projects}
          activeId={active?.id || null}
          onSelect={(p) => { setActive(p); setPaletteOpen(false); }}
          onClose={() => setPaletteOpen(false)}
        />
      )}
      {searchOpen && (
        <SearchModal
          projects={projects}
          onSelect={(p) => { setActive(p); setSearchOpen(false); }}
          onClose={() => setSearchOpen(false)}
        />
      )}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
      {addOpen && <AddProjectModal onAdd={addProject} onClose={() => setAddOpen(false)} />}
    </div>
  );
}

export default App;
