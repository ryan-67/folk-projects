import { useState, useCallback, useRef } from 'react';
import { FileText, Link2, CheckCircle2, Activity, MessageSquare, GripVertical } from 'lucide-react';
import type { Project } from './Sidebar';
import { useProjectStore } from '../hooks/useProjectStore';
import BriefPanel from './BriefPanel';
import ActivityTimeline from './ActivityTimeline';
import BrainLinks from './BrainLinks';
import UpcomingPanel from './UpcomingPanel';
import InlineChat from './InlineChat';
import LinkPreview from './LinkPreview';
import ProgressRing from './ProgressRing';

interface Props {
  project: Project;
}

export default function Workspace({ project }: Props) {
  const { data, addTodo, toggleTodo, deleteTodo, addLink, deleteLink, updateNotes, addChat } = useProjectStore(project.id);
  const [newTodo, setNewTodo] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim());
    setNewTodo('');
  }, [newTodo, addTodo]);

  const handleAddLink = useCallback(() => {
    if (!newUrl.trim()) return;
    addLink(newUrl.trim());
    setNewUrl('');
    setShowLinkForm(false);
  }, [newUrl, addLink]);

  const doneCount = data.todos.filter(t => t.done).length;

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="project-title">
          <div className="project-avatar" style={{ background: project.color || '#6366f1' }}>{project.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
          <div>
            <h1>{project.name}</h1>
            <div className="project-meta">{data.todos.length} todos &middot; {doneCount} done &middot; {data.links.length} links &middot; last active {formatAgo(data.lastActivityAt)}</div>
          </div>
        </div>
        <div className="header-actions">
          <ProgressRing todoCount={data.todos.length} doneCount={doneCount} />
          <button className="open-chat-btn" onClick={() => {
            const el = document.querySelector('.inline-chat');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }}>
            <MessageSquare size={14} /> Chat
          </button>
        </div>
      </div>
      <div className="workspace-body">
        <div className="workspace-left">
          <div className="notes-panel">
            <div className="panel-header"><FileText size={14} /> Notes</div>
            <div style={{ position: 'relative' }}>
              <textarea
                ref={textareaRef}
                className="notes-editor"
                placeholder="Start typing, or press / for commands..."
                value={data.notes}
                onChange={e => {
                  updateNotes(e.target.value);
                  const cursor = e.target.selectionStart;
                  const before = e.target.value.slice(0, cursor);
                  const line = before.split('\n').pop() || '';
                  if (line.startsWith('/')) { setShowSlash(true); setSlashIndex(0); }
                  else { setShowSlash(false); }
                }}
                onKeyDown={e => {
                  if (!showSlash) return;
                  const ta = e.currentTarget;
                  const cursor = ta.selectionStart;
                  const val = ta.value;
                  const before = val.slice(0, cursor);
                  const line = (before.split('\n').pop() || '').slice(1).toLowerCase();
                  const items = ['Insert todo','Insert date','Insert time','Heading','Clear notes'].filter(l => l.toLowerCase().includes(line));
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIndex(i => Math.min(i + 1, items.length - 1)); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIndex(i => Math.max(i - 1, 0)); }
                  else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    const choice = items[slashIndex];
                    if (!choice) return;
                    const lineStart = val.lastIndexOf('\n', cursor - 1) + 1;
                    let insert = '';
                    if (choice === 'Insert todo') insert = '- [ ] ';
                    else if (choice === 'Insert date') insert = new Date().toLocaleDateString() + ' ';
                    else if (choice === 'Insert time') insert = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + ' ';
                    else if (choice === 'Heading') insert = '## ';
                    else if (choice === 'Clear notes') insert = '';
                    const newVal = val.slice(0, lineStart) + insert + val.slice(cursor);
                    updateNotes(newVal);
                    setShowSlash(false);
                    setTimeout(() => { if (textareaRef.current) { const pos = lineStart + insert.length; textareaRef.current.setSelectionRange(pos, pos); textareaRef.current.focus(); } }, 0);
                  } else if (e.key === 'Escape') { setShowSlash(false); }
                }}
              />
              {showSlash && (
                <div className="slash-menu">
                  {['Insert todo','Insert date','Insert time','Heading','Clear notes'].filter(l => {
                    const ta = textareaRef.current;
                    if (!ta) return true;
                    const q = (ta.value.slice(0, ta.selectionStart).split('\n').pop() || '').slice(1).toLowerCase();
                    return l.toLowerCase().includes(q);
                  }).map((label, i) => (
                    <div key={label} className={`slash-item ${i === slashIndex ? 'active' : ''}`} onMouseEnter={() => setSlashIndex(i)} onClick={() => {
                      const ta = textareaRef.current; if (!ta) return;
                      const cursor = ta.selectionStart;
                      const val = ta.value;
                      const lineStart = val.lastIndexOf('\n', cursor - 1) + 1;
                      let insert = '';
                      if (label === 'Insert todo') insert = '- [ ] ';
                      else if (label === 'Insert date') insert = new Date().toLocaleDateString() + ' ';
                      else if (label === 'Insert time') insert = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + ' ';
                      else if (label === 'Heading') insert = '## ';
                      else if (label === 'Clear notes') insert = '';
                      updateNotes(val.slice(0, lineStart) + insert + val.slice(cursor));
                      setShowSlash(false);
                      setTimeout(() => { const pos = lineStart + insert.length; ta.setSelectionRange(pos, pos); ta.focus(); }, 0);
                    }}>
                      <span style={{width:14,height:14,display:'inline-block',opacity:0.6}}>•</span>
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <InlineChat messages={data.chatHistory} onSend={(text) => {
            addChat('user', text);
            setTimeout(() => {
              const replies = [
                `Got it. I added "${text}" to my context for ${project.name}.`,
                `I remember you mentioned something similar in the brain graph last week. Want me to pull that up?`,
                `Based on your notes, you might also want to check the link "${data.links[0]?.title || 'your pinned link'}".`,
                `I can turn that into a scheduled task if you'd like. Just say the word.`,
              ];
              addChat('folk', replies[Math.floor(Math.random()*replies.length)]);
            }, 600 + Math.random()*800);
          }} />
        </div>
        <div className="workspace-right">
          <UpcomingPanel items={data.crossSurfaces} />
          <BrainLinks memories={data.memories} />
          <div className="rail-section">
            <div className="panel-header"><CheckCircle2 size={14} /> Todos</div>
            <div className="todo-list">
              {data.todos.map(t => (
                <div key={t.id} className="todo-item">
                  <GripVertical size={12} className="drag-handle" style={{ color:'rgb(var(--color-ink) / var(--ink-soft-4))', flexShrink:0, cursor:'grab' }} />
                  <div className={`todo-check ${t.done ? 'checked' : ''}`} onClick={() => toggleTodo(t.id)}>
                    {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div className={`todo-text ${t.done ? 'done' : ''}`}>{t.text}</div>
                  <div className="todo-delete" onClick={() => deleteTodo(t.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
                </div>
              ))}
            </div>
            <input
              className="todo-input"
              placeholder="Add a todo..."
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddTodo(); }}
            />
          </div>
          <div className="rail-section">
            <div className="panel-header"><Link2 size={14} /> Links</div>
            <div className="link-list">
              {data.links.map(l => (
                <LinkPreview key={l.id} link={l} onDelete={deleteLink} />
              ))}
            </div>
            {!showLinkForm && (
              <button className="link-add-btn" onClick={() => setShowLinkForm(true)}>Add link</button>
            )}
            {showLinkForm && (
              <div className="link-inputs">
                <input className="link-input" placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                <button className="link-add-btn" onClick={handleAddLink}>Save</button>
                <button className="btn-secondary" style={{marginTop:4, alignSelf:'flex-start'}} onClick={() => setShowLinkForm(false)}>Cancel</button>
              </div>
            )}
          </div>
          <div className="rail-section">
            <div className="panel-header"><Activity size={14} /> Timeline</div>
            <ActivityTimeline activities={data.activities} />
          </div>
          <BriefPanel notes={data.notes} todos={data.todos} activities={data.activities} _projectName={project.name} />
        </div>
      </div>
    </div>
  );
}

function formatAgo(ts: string) {
  const h = Math.max(1, Math.floor((Date.now() - new Date(ts).getTime()) / 3600000));
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
