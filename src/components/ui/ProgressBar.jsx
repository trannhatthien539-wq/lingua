export default function ProgressBar({ value, color = '' }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200/60 dark:bg-white/[0.1]">
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{
          width: `${value}%`,
          ...(!color ? { background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))' } : {}),
        }}
      />
    </div>
  );
}
