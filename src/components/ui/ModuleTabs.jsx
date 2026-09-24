/** Dải điều hướng dạng tab dùng chung cho các module. */
export default function ModuleTabs({ items, value, onChange, ariaLabel = "Điều hướng module" }) {
  return (
    <nav className="panel flex flex-wrap gap-1.5 p-3" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.id === value;
        const Icon = item.icon;
        return <button key={item.id} type="button" onClick={() => onChange(item.id)} aria-pressed={active} className={`inline-flex min-h-11 min-w-max items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition ${active ? "bg-ink text-white shadow-raised dark:bg-lime dark:text-ink" : "text-ink/65 hover:bg-ink/[0.05] dark:text-white/65 dark:hover:bg-white/[0.08]"}`}><Icon size={15} />{item.label}</button>;
      })}
    </nav>
  );
}
