import { useState } from 'react';
import type { Project } from './Sidebar';

interface Props {
  onAdd: (p: Project) => void;
  onClose: () => void;
}

const TEMPLATES = [
  { id: 'blank', name: 'Blank project', icon: '\u25a1', desc: 'Start from scratch' },
  { id: 'job', name: 'Job Search', icon: '\ud83d\udcbc', desc: 'Track applications, interviews, and follow-ups' },
  { id: 'side', name: 'Side Project', icon: '\ud83d\ude80', desc: 'Build something on the side with milestones' },
  { id: 'trip', name: 'Trip Planning', icon: '\u2708\ufe0f', desc: 'Flights, bookings, and itinerary' },
  { id: 'study', name: 'Learning Track', icon: '\ud83d\udcda', desc: 'Courses, papers, and study schedule' },
];

const COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#8b5cf6','#ef4444','#06b6d4','#84cc16'];

export default function AddProjectModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const p: Project = {
      id: `project_${Date.now()}`,
      name: name.trim(),
      color,
      template: selectedTemplate,
    };
    onAdd(p);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="add-body">
            <div className="panel-header">New Project</div>
            <input className="add-input" placeholder="Project name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            <div style={{ fontSize: 12, color: 'rgb(var(--color-ink) / var(--ink-soft-2))', fontWeight: 600, marginBottom: 4 }}>Template</div>
            <div className="template-list">
              {TEMPLATES.map(t => (
                <div key={t.id} className={`template-card ${selectedTemplate === t.id ? 'selected' : ''}`} onClick={() => setSelectedTemplate(t.id)}>
                  <div className="template-icon">{t.icon}</div>
                  <div className="template-name">{t.name}</div>
                  <div className="template-desc">{t.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgb(var(--color-ink) / var(--ink-soft-2))', fontWeight: 600, marginTop: 8 }}>Accent</div>
            <div className="color-picker">
              {COLORS.map(c => (
                <div key={c} className={`color-swatch ${color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
            <div className="add-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">Create project</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
