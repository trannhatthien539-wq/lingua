import { Library, Plus } from "lucide-react";

export default function NewDeckCard({ onClick }) {
  return <button type="button" onClick={onClick} className="panel flex min-h-[320px] w-full flex-col items-center justify-center gap-4 border-2 border-dashed border-ink/15 bg-slab2/70 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:shadow-lg dark:border-white/15 dark:bg-dark3/70"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/65"><Plus size={28} strokeWidth={2} /></span><span><span className="block font-display text-base font-bold">Tạo bộ thẻ mới...</span><span className="mx-auto mt-1 block max-w-[190px] text-xs leading-5 text-ink/55 dark:text-white/55">Tổ chức từ vựng theo chủ đề của riêng bạn.</span></span><span className="inline-flex items-center gap-1.5 text-xs font-bold text-sage"><Library size={14} />Bắt đầu ngay</span></button>;
}
