import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  CornerDownLeft,
  Eraser,
  FileText,
  History,
  LoaderCircle,
  Send,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react'
import { canUseAi, parseAiJson, requestAi } from '../../services/aiService'
import { useDebounce } from '../../hooks/useDebounce'
import useCloudDoc from '../../hooks/useCloudDoc'
import { userDocKeys } from '../../services/userDocService'
import SectionHeader from '../../components/ui/SectionHeader'
import { toast } from '../../services/toast'

const PROVIDER_STORAGE = 'lingua-ai-provider'
const WRITING_HISTORY_STORAGE = 'lingua-writing-history'
const defaultText = 'I have been learning English for three years, and I want to improve my writing skills.'

const WRITING_GENRES = [
  { id: 'general', label: 'Tự do / Tổng quát', desc: 'Sửa ngữ pháp & tự nhiên' },
  { id: 'vstep_task1', label: 'VSTEP Task 1', desc: 'Thư điện tử / Letter' },
  { id: 'vstep_task2', label: 'VSTEP Task 2', desc: 'Bài luận xã hội / Essay' },
  { id: 'ielts_task2', label: 'IELTS Task 2', desc: 'Luận chuẩn học thuật' },
  { id: 'business', label: 'Email công việc', desc: 'Trang trọng & súc tích' },
]

const buildGrammarPrompt = (text, genre = 'general') => {
  const genreGuide = {
    general: 'Phân tích ngữ pháp và viết lại cho tự nhiên.',
    vstep_task1: 'Đánh giá theo chuẩn VSTEP Task 1 (viết thư ~120 từ): lời chào, bố cục đoạn, giọng điệu phù hợp (formal/informal).',
    vstep_task2: 'Đánh giá theo chuẩn VSTEP Task 2 (bài luận ~250 từ): câu chủ đề, luận điểm, liên kết từ, cấu trúc phức B2-C1.',
    ielts_task2: 'Đánh giá theo 4 tiêu chí IELTS Task 2: Task Response, Coherence/Cohesion, Lexical Resource, Grammar Accuracy.',
    business: 'Đánh giá theo email công việc quốc tế: trang trọng, ngắn gọn, lịch thiệp, cấu trúc rõ ràng.',
  }[genre] || 'Phân tích ngữ pháp và văn phong.'

  return `Bạn là giáo viên tiếng Anh cao cấp. Yêu cầu thể loại: ${genreGuide}.
Phân tích đoạn văn sau: "${text}".
Chỉ trả về JSON hợp lệ theo schema sau (không markdown, không giải thích ngoài JSON):
{"score":number (thang điểm 10, làm tròn 0.5),"summary":"nhận xét ngắn gọn sắc sảo bằng tiếng Việt","corrections":[{"original":"cụm sai","corrected":"cách viết chuẩn","explanation":"giải thích ngắn gọn bằng tiếng Việt"}],"rewritten":"toàn bộ đoạn văn đã viết lại hoàn hảo"}`
}

export function WritingChecker({ apiKey }) {
  const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
  const { value: draft, setValue: setDraft } = useCloudDoc(userDocKeys.writing, {
    initial: { text: defaultText, result: null, genre: 'general' },
  })
  const text = typeof draft?.text === 'string' ? draft.text : defaultText
  const result = draft?.result || null
  const [genre, setGenre] = useState(() => draft?.genre || 'general')
  const [activeTab, setActiveTab] = useState('result') // 'result' | 'history'

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WRITING_HISTORY_STORAGE) || '[]')
    } catch {
      return []
    }
  })

  const setText = (value) => setDraft((current) => ({ ...current, text: value }))
  const setResult = (value) => setDraft((current) => ({ ...current, result: value }))
  const debouncedText = useDebounce(text)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text])

  const saveToHistory = (item) => {
    setHistory((prev) => {
      const next = [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 20)
      try {
        localStorage.setItem(WRITING_HISTORY_STORAGE, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const deleteHistoryItem = (id, event) => {
    event?.stopPropagation()
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(WRITING_HISTORY_STORAGE, JSON.stringify(next))
      } catch {}
      return next
    })
    toast.success('Đã xoá mục lịch sử.')
  }

  const checkGrammar = async () => {
    if (!canUseAi(apiKey, provider)) return setError('Vui lòng nhập API key trong Cài đặt để dùng AI.')
    if (!debouncedText.trim()) return setError('Vui lòng nhập đoạn văn để phân tích.')
    setLoading(true)
    setError('')
    try {
      const response = await requestAi(provider, apiKey, buildGrammarPrompt(debouncedText, genre), { json: true })
      const parsedResult = parseAiJson(response)
      setResult(parsedResult)
      setActiveTab('result')

      // Lưu vào lịch sử bài đã sửa
      saveToHistory({
        id: `w-${Date.now()}`,
        date: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        genre,
        wordCount,
        score: parsedResult?.score ?? null,
        summary: parsedResult?.summary || '',
        text: debouncedText,
        result: parsedResult,
      })
    } catch (requestError) {
      setError(requestError.message || 'Không thể phân tích văn bản.')
    } finally {
      setLoading(false)
    }
  }

  const clearText = () => {
    setText('')
    setResult(null)
    setError('')
  }

  const applyRewritten = (rewritten) => {
    if (!rewritten) return
    setText(rewritten)
    toast.success('Đã áp dụng bản viết lại vào khung soạn thảo.')
  }

  const loadFromHistory = (item) => {
    setText(item.text)
    setResult(item.result)
    setGenre(item.genre || 'general')
    setActiveTab('result')
    toast.success('Đã nạp lại bài viết từ lịch sử.')
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Sửa bài viết bằng AI"
        meta="Tìm lỗi ngữ pháp, chấm điểm theo thể loại và viết lại văn phong tự nhiên"
      />

      {/* Thanh chọn thể loại bài viết */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Thể loại:</span>
        <div className="flex flex-wrap gap-1.5">
          {WRITING_GENRES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGenre(g.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                genre === g.id
                  ? 'border border-indigo-500/40 bg-indigo-500/15 text-indigo-600 shadow-xs dark:border-indigo-400/40 dark:bg-indigo-500/20 dark:text-indigo-400'
                  : 'border border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Editor cột trái */}
        <section className="panel flex flex-col p-4 sm:p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-white/[0.08]">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Đoạn văn ({wordCount} từ)
            </span>
            {text && (
              <button
                type="button"
                onClick={clearText}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
              >
                <Eraser size={13} />
                Xoá bài
              </button>
            )}
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-3 min-h-[300px] w-full flex-1 resize-none bg-transparent text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
            placeholder="Dán hoặc viết bài viết tiếng Anh vào đây..."
          />

          {error && <ErrorMessage message={error} />}

          <button
            type="button"
            onClick={checkGrammar}
            disabled={loading || !text.trim()}
            className="btn-primary mt-4 h-11 w-full justify-center text-xs font-bold shadow-md shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
            {loading ? 'Đang phân tích...' : `Chấm bài · ${WRITING_GENRES.find((g) => g.id === genre)?.label || 'AI'}`}
          </button>
        </section>

        {/* Cột phải: Kết quả & Lịch sử */}
        <section className="panel flex flex-col p-4 sm:p-5 lg:col-span-6">
          {/* Tabs chuyển đổi Kết quả / Lịch sử */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-white/[0.08]">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab('result')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === 'result'
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Kết quả phân tích
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <History size={13} />
                <span>Lịch sử ({history.length})</span>
              </button>
            </div>
          </div>

          {activeTab === 'result' ? (
            result ? (
              <ResultView result={result} onApplyRewritten={applyRewritten} />
            ) : (
              <div className="flex min-h-[340px] flex-1 flex-col items-center justify-center rounded-xl bg-slate-50/70 p-6 text-center dark:bg-white/[0.03]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <Sparkles size={22} />
                </div>
                <p className="mt-3 font-display text-sm font-bold text-slate-800 dark:text-slate-200">
                  Kết quả sửa bài sẽ hiện ở đây
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                  AI sẽ chấm điểm theo thể loại bạn chọn, giải thích từng lỗi sai và cung cấp phiên bản viết lại tự nhiên.
                </p>
              </div>
            )
          ) : (
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              {history.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                  <FileText size={24} className="text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-xs font-medium text-slate-400">Chưa có bài viết nào trong lịch sử.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="group relative flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 shadow-xs transition hover:border-indigo-500/40 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-indigo-400/30 dark:hover:bg-white/[0.06]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {WRITING_GENRES.find((g) => g.id === item.genre)?.label || 'Bài viết'}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                        {item.score !== null && (
                          <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                            {item.score}/10
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {item.text}
                      </p>
                      {item.summary && (
                        <p className="mt-1 truncate text-[11px] italic text-slate-400 dark:text-slate-500">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => deleteHistoryItem(item.id, e)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      title="Xoá bản ghi này"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ResultView({ result, onApplyRewritten }) {
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(copiedTimerRef.current), [])

  const copyText = async () => {
    await navigator.clipboard.writeText(result.rewritten || '')
    setCopied(true)
    window.clearTimeout(copiedTimerRef.current)
    copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1600)
    toast.success('Đã sao chép văn bản viết lại.')
  }

  const corrections = result.corrections || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-white/[0.08]">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Nhận xét của AI
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {corrections.length ? `${corrections.length} điểm cần sửa` : 'Văn phong tốt, không có lỗi lớn'}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-center">
          <span className="font-display text-lg font-black text-indigo-600 dark:text-indigo-400">
            {result.score ?? '--'}
          </span>
          <span className="ml-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">/ 10</span>
        </div>
      </div>

      {result.summary && (
        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {result.summary}
        </p>
      )}

      {corrections.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Chi tiết lỗi ({corrections.length})
          </p>
          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            {corrections.map((item, index) => (
              <div
                key={`${item.original}-${index}`}
                className="rounded-xl border border-rose-200/70 bg-rose-50/50 p-3 dark:border-rose-500/20 dark:bg-rose-950/20"
              >
                <div className="flex flex-wrap items-baseline gap-2 text-xs">
                  <span className="font-semibold text-rose-600 line-through dark:text-rose-400">
                    {item.original}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {item.corrected}
                  </span>
                </div>
                {item.explanation && (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {corrections.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={16} />
          Không phát hiện lỗi ngữ pháp rõ ràng.
        </div>
      )}

      {result.rewritten && (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <WandSparkles size={14} />
              Bản viết lại tự nhiên
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onApplyRewritten?.(result.rewritten)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                title="Thay thế văn bản trong khung soạn thảo bằng bản viết lại"
              >
                <CornerDownLeft size={13} />
                Áp dụng vào bài
              </button>
              <button
                type="button"
                onClick={copyText}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200">
            {result.rewritten}
          </p>
        </div>
      )}
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400">
      <AlertCircle className="mt-0.5 shrink-0" size={14} />
      <span>{message}</span>
    </div>
  )
}
