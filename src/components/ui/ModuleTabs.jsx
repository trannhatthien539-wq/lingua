/** Dải điều hướng dạng tab dùng chung cho các module. */
export default function ModuleTabs({ items, value, onChange, ariaLabel = "Điều hướng module" }) {
  return (
    <nav className="panel flex max-w-full snap-x gap-1 overflow-x-auto p-1.5 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:p-3 [&::-webkit-scrollbar]:hidden" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.id === value;
        const Icon = item.icon;
        return <button key={item.id} type="button" onClick={() => onChange(item.id)} aria-pressed={active} className={`inline-flex min-h-10 min-w-max shrink-0 snap-start items-center gap-2 rounded-xl px-3 text-xs font-bold transition sm:min-h-11 sm:px-3.5 ${active ? "bg-ink text-white shadow-raised dark:bg-lime dark:text-ink" : "text-ink/65 hover:bg-ink/[0.05] dark:text-white/65 dark:hover:bg-white/[0.08]"}`}><Icon size={15} />{item.label}</button>;
      })}
    </nav>
  );
}
