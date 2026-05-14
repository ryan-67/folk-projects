interface Props {
  todoCount: number;
  doneCount: number;
}

export default function ProgressRing({ todoCount, doneCount }: Props) {
  const pct = todoCount === 0 ? 0 : Math.round((doneCount / todoCount) * 100);
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const dash = circ - (circ * pct) / 100;

  return (
    <div className="progress-ring" title={`${doneCount}/${todoCount} done`}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="rgb(var(--color-ink) / var(--ink-soft-4))" strokeWidth="3" />
        <circle cx="22" cy="22" r={radius} fill="none" stroke="rgb(var(--color-sage))" strokeWidth="3" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" transform="rotate(-90 22 22)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <span className="progress-label">{pct}%</span>
    </div>
  );
}
