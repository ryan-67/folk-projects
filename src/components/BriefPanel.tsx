import { Lightbulb, ArrowRight } from 'lucide-react';
import type { TodoItem, ActivityItem } from '../hooks/useProjectStore';

interface Props {
  notes: string;
  todos: TodoItem[];
  activities: ActivityItem[];
  _projectName: string;
}

function generateSuggestions(_projectName: string, todos: TodoItem[], notes: string, activities: ActivityItem[]) {
  const openTodos = todos.filter(t => !t.done);
  const recentLink = activities.find(a => a.type === 'link');
  const recentNote = notes.length > 20;
  const suggestions: { text: string; action: string }[] = [];

  if (openTodos.length > 0) {
    const oldest = openTodos[0];
    suggestions.push({ text: `You still need to: "${oldest.text}"`, action: 'Focus on oldest todo' });
  }
  if (!recentNote && openTodos.length > 2) {
    suggestions.push({ text: 'Add a note with context so folk can help better', action: 'Write notes' });
  }
  if (recentLink) {
    suggestions.push({ text: `Review the link you added: ${recentLink.text.replace('added link: ', '')}`, action: 'Review link' });
  }
  if (openTodos.length === 0 && todos.length > 0) {
    suggestions.push({ text: 'All tasks done. Archive or add next milestone?', action: 'Close project' });
  }
  if (suggestions.length === 0) {
    suggestions.push({ text: 'Add some todos to get started', action: 'Add todo' });
  }
  return suggestions;
}

export default function BriefPanel({ notes, todos, activities, _projectName }: Props) {
  const suggestions = generateSuggestions(_projectName, todos, notes, activities);

  return (
    <div className="rail-section">
      <div className="panel-header"><Lightbulb size={14} /> Folk Suggests</div>
      <div className="brief-suggest">
        <div className="brief-suggest-title">Next best actions</div>
        <ul>
          {suggestions.map((s, i) => (
            <li key={i}><ArrowRight size={12} /> {s.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
