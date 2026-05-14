// TODO: Replace localStorage with Folk's existing sync layer (Yjs / CRDT-based)
// for offline-write, online-sync, and conflict resolution across devices.
// This prototype uses localStorage for demo persistence.

import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../components/Sidebar';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
  scheduled?: boolean; // linked to Folk Scheduled surface
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  domain: string;
  favicon?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'todo' | 'link' | 'note' | 'chat' | 'suggest' | 'folk';
  text: string;
  timestamp: string;
  folkGenerated?: boolean;
}

export interface BrainMemory {
  id: string;
  summary: string;
  source: string;
  timestamp: string;
}

export interface CrossSurfaceItem {
  id: string;
  type: 'errand' | 'scheduled';
  text: string;
  due?: string;
  projectId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'folk';
  text: string;
  timestamp: string;
}

export interface ProjectData {
  notes: string;
  todos: TodoItem[];
  links: LinkItem[];
  activities: ActivityItem[];
  memories: BrainMemory[];
  crossSurfaces: CrossSurfaceItem[];
  chatHistory: ChatMessage[];
  createdAt: string;
  lastActivityAt: string;
  template?: string;
}

export const STORE_VERSION = 'v5';

function getKey(id: string) { return `folk_projects_data_${id}`; }

export function loadProjectData(id: string): ProjectData {
  try {
    const raw = localStorage.getItem(getKey(id));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.todos && parsed.activities) return parsed;
    }
  } catch {}
  return emptyData();
}

export function saveProjectData(id: string, data: ProjectData) {
  localStorage.setItem(getKey(id), JSON.stringify(data));
}

export function emptyData(): ProjectData {
  return {
    notes: '',
    todos: [],
    links: [],
    activities: [],
    memories: [],
    crossSurfaces: [],
    chatHistory: [],
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };
}

export function seedDemoData(projects: Project[]) {
  const version = localStorage.getItem('folk_projects_version');
  if (version === STORE_VERSION) return;
  localStorage.removeItem('folk_projects_list'); // force list refresh when template data changes

  projects.forEach((p, idx) => {
    const base = emptyData();
    const seed = (p as any).__seed;
    base.notes = seed?.notes || '';
    base.todos = (seed?.todos || []).map((t: string) => ({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      text: t,
      done: false,
      createdAt: new Date().toISOString(),
    }));
    base.links = (seed?.links || []).map((u: string) => ({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      url: u,
      title: u.replace(/^https?:\/\/([^\/]+).*$/, '$1'),
      domain: u.replace(/^https?:\/\/([^\/]+).*$/, '$1'),
      createdAt: new Date().toISOString(),
    }));
    base.activities = (seed?.activities || []).map((a: any) => ({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      type: (a.type || 'note') as ActivityItem['type'],
      text: a.text,
      timestamp: new Date(Date.now() - a.agoMinutes * 60000).toISOString(),
    }));
    base.memories = (seed?.memories || []).map((m: any) => ({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      summary: m.summary,
      source: m.source,
      timestamp: new Date(Date.now() - m.agoDays * 86400000).toISOString(),
    }));
    base.crossSurfaces = (seed?.crossSurfaces || []).map((c: any) => ({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      type: c.type,
      text: c.text,
      due: c.due ? new Date(Date.now() + c.dueDays * 86400000).toISOString() : undefined,
      projectId: p.id,
    }));
    base.chatHistory = (seed?.chatHistory || []).map((c: any) => ({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      role: c.role,
      text: c.text,
      timestamp: new Date(Date.now() - c.agoMinutes * 60000).toISOString(),
    }));
    base.createdAt = new Date(Date.now() -(idx*2+1)*86400000).toISOString();
    base.lastActivityAt = new Date(Date.now() - (idx ===0 ? 120 : idx*600)*60000).toISOString();
    saveProjectData(p.id, base);
  });
  localStorage.setItem('folk_projects_version', STORE_VERSION);
}

export function useProjectStore(projectId: string) {
  const [data, setData] = useState<ProjectData>(() => loadProjectData(projectId));

  useEffect(() => { setData(loadProjectData(projectId)); }, [projectId]);

  const persist = useCallback((next: ProjectData) => {
    next.lastActivityAt = new Date().toISOString();
    saveProjectData(projectId, next);
    setData(next);
  }, [projectId]);

  const addTodo = useCallback((text: string, scheduled = false) => {
    const next: ProjectData = { ...data, todos: [...data.todos, {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      text,
      done: false,
      createdAt: new Date().toISOString(),
      scheduled,
    }], activities: [...data.activities, {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      type: 'todo' as const,
      text: `added todo: ${text}`,
      timestamp: new Date().toISOString(),
    }] };
    persist(next);
  }, [data, persist]);

  const toggleTodo = useCallback((id: string) => {
    const next = { ...data, todos: data.todos.map(t => t.id === id ? { ...t, done: !t.done } : t) };
    persist(next);
  }, [data, persist]);

  const deleteTodo = useCallback((id: string) => {
    const next = { ...data, todos: data.todos.filter(t => t.id !== id) };
    persist(next);
  }, [data, persist]);

  const addLink = useCallback((url: string) => {
    const domain = url.replace(/^https?:\/\/([^\/]+).*$/, '$1');
    const title = domain;
    const next: ProjectData = { ...data, links: [...data.links, {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      url,
      title,
      domain,
      createdAt: new Date().toISOString(),
    }], activities: [...data.activities, {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      type: 'link' as const,
      text: `added link: ${domain}`,
      timestamp: new Date().toISOString(),
    }] };
    persist(next);
  }, [data, persist]);

  const deleteLink = useCallback((id: string) => {
    const next = { ...data, links: data.links.filter(l => l.id !== id) };
    persist(next);
  }, [data, persist]);

  const updateNotes = useCallback((notes: string) => {
    const next = { ...data, notes };
    persist(next);
  }, [data, persist]);

  const addChat = useCallback((role: 'user' | 'folk', text: string) => {
    const next: ProjectData = { ...data, chatHistory: [...data.chatHistory, {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      role,
      text,
      timestamp: new Date().toISOString(),
    }], activities: [...data.activities, {
      id: crypto.randomUUID?.() || `${Date.now()}`,
      type: 'chat' as const,
      text: role === 'folk' ? `folk: ${text.substring(0, 40)}...` : `you: ${text.substring(0, 40)}...`,
      timestamp: new Date().toISOString(),
      folkGenerated: role === 'folk',
    }] };
    persist(next);
  }, [data, persist]);

  return { data, addTodo, toggleTodo, deleteTodo, addLink, deleteLink, updateNotes, addChat, persist };
}
