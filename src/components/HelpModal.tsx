import { Keyboard, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function HelpModal({ onClose }: Props) {
  const shortcuts = [
    { keys: ['Cmd', 'K'], action: 'Switch project' },
    { keys: ['Cmd', 'Shift', 'F'], action: 'Global search' },
    { keys: ['Cmd', 'N'], action: 'New project' },
    { keys: ['Cmd', '/'], action: 'Show shortcuts' },
    { keys: ['Esc'], action: 'Close modal' },
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={e => e.stopPropagation()}>
        <div className="help-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Keyboard size={16} /> Keyboard Shortcuts
          <span style={{ marginLeft: 'auto', cursor: 'pointer', color: 'rgb(var(--color-ink) / var(--ink-soft-3))' }} onClick={onClose}><X size={16} /></span>
        </div>
        <div className="help-list">
          {shortcuts.map((s, i) => (
            <div key={i} className="help-row">
              <div className="help-keys">
                {s.keys.map((k, j) => (
                  <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <kbd>{k}</kbd>{j < s.keys.length - 1 && <span style={{ color: 'rgb(var(--color-ink) / var(--ink-soft-3))' }}>+</span>}
                  </span>
                ))}
              </div>
              <div className="help-action">{s.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
