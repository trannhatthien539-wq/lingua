import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Eraser,
  LoaderCircle,
  Send,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { canUseAi, parseAiJson, requestAi } from '../../services/aiService'
import { useDebounce } from '../../hooks/useDebounce'
import useCloudDoc from '../../hooks/useCloudDoc'
import { userDocKeys } from '../../services/userDocService'
import SectionHeader from '../../components/ui/SectionHeader'

const PROVIDER_STORAGE = 'lingua-ai-provider'
const defaultText = 'I have been learning English for three years, and I want to improve my writing skills.'

const grammarPrompt = (text) =>
  `Bạn là giáo viên tiếng Anh. Phân tích đoạn văn sau: "${text}". Chỉ trả về JSON hợp lệ, không markdown, theo schema: {"score":number,"summary":"giải thích ngắn bằng tiếng Việt","corrections":[{"original":"câu hoặc cụm sai","corrected":"cách viết đúng tự nhiên hơn","explanation":"giải thích ngắn bằng tiếng Việt"}],"rewritten":"toàn bộ đoạn văn đã viết lại tự nhiên"}. Nếu không có lỗi, corrections là mảng rỗng.`

export function WritingChecker({ apiKey }) {
  const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
  const { value: draft, setValue: setDraft } = useCloudDoc(userDocKeys.writing, {
    initial: { text: defaultText, result: null },
  })
  const text = typeof draft?.text === 'string' ? draft.text : defaultText
  const result = draft?.result || null
  const setText = (value) => setDraft((current) => ({ ...current, text: value }))
  const setResult = (value) => setDraft((current) => ({ ...current, result: value }))
  const debouncedText = useDebounce(text)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text])

  const checkGrammar = async () => {
    if (!canUseAi(apiKey, provider)) return setError('Vui lòng nhập API key trong Cài đặt để dùng AI.')
    if (!debouncedText.trim()) return setError('Vui lòng nhập đoạn văn để phân tích.')
    setLoading(true)
    setError('')
    try {
      setResult(parseAiJson(await requestAi(provider, apiKey, grammarPrompt(debouncedText), { json: true })))
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

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Sửa bài viết bằng AI"
        meta="Tìm lỗi ngữ pháp, chấm điểm và viết lại văn phong tự nhiên"
      />

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
            className="mt-3 min-h-[280px] w-full flex-1 resize-none bg-transparent text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
            placeholder="Dán hoặc viết đoạn văn tiếng Anh vào đây..."
          />

          {error && <ErrorMessage message={error} />}

          <button
            type="button"
            onClick={checkGrammar}
            disabled={loading || !text.trim()}
            className="btn-primary mt-4 h-11 w-full justify-center text-xs font-bold shadow-md shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
            {loading ? 'Đang phân tích...' : 'Chấm & sửa bài viết'}
          </button>
        </section>

        {/* Kết quả cột phải */}
        <section className="panel p-4 sm:p-5 lg:col-span-6">
          {result ? (
            <ResultView result={result} />
          ) : (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl bg-slate-50/70 p-6 text-center dark:bg-white/[0.03]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Sparkles size={22} />
              </div>
              <p className="mt-3 font-display text-sm font-bold text-slate-800 dark:text-slate-200">
                Kết quả sửa bài sẽ hiện ở đây
              </p>
              <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                AI sẽ chấm điểm, chỉ ra từng lỗi sai và cung cấp phiên bản viết lại tự nhiên.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ResultView({ result }) {
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(copiedTimerRef.current), [])

  const copyText = async () => {
    await navigator.clipboard.writeText(result.rewritten || '')
    setCopied(true)
    window.clearTimeout(copiedTimerRef.current)
    copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1600)
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
            <button
              type="button"
              onClick={copyText}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
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
