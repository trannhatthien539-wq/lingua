import { useEffect, useMemo, useRef, useState } from 'react'
import ModuleHero from '../../components/ui/ModuleHero'
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  LoaderCircle,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react'
import { canUseAi, parseAiJson, requestAi } from '../../services/aiService'
import { useDebounce } from '../../hooks/useDebounce'
import useCloudDoc from '../../hooks/useCloudDoc'
import { userDocKeys } from '../../services/userDocService'

const PROVIDER_STORAGE = 'lingua-ai-provider'
const VOCABULARY_STORAGE = 'lingua-vocabulary'

const defaultText = 'I have been learning English for three years, and I want to improve my writing.'

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const vocabularyPrompt = (topic) => `Bạn là giáo viên tiếng Anh. Hãy tạo đúng 5 từ vựng tiếng Anh theo chủ đề "${topic}". Chỉ trả về JSON hợp lệ, không markdown, theo schema: {"words":[{"word":"...","pronunciation":"...","meaning":"...","example":"..."}]}. Nghĩa và giải thích bằng tiếng Việt, ví dụ bằng tiếng Anh.`
const grammarPrompt = (text) => `Bạn là giáo viên tiếng Anh. Phân tích đoạn văn sau: "${text}". Chỉ trả về JSON hợp lệ, không markdown, theo schema: {"score":number,"summary":"giải thích ngắn bằng tiếng Việt","corrections":[{"original":"câu hoặc cụm sai","corrected":"cách viết đúng tự nhiên hơn","explanation":"giải thích ngắn bằng tiếng Việt"}],"rewritten":"toàn bộ đoạn văn đã viết lại tự nhiên"}. Nếu không có lỗi, corrections là mảng rỗng.`

function FieldLabel({ children }) {
  return <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">{children}</span>
}

export function VocabularyHub({ apiKey }) {
  const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
  const [topic, setTopic] = useState('Du lịch')
  const debouncedTopic = useDebounce(topic)
  const [word, setWord] = useState('')
  const [words, setWords] = useState(() => readStorage(VOCABULARY_STORAGE, []))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => localStorage.setItem(VOCABULARY_STORAGE, JSON.stringify(words)), [words])

  const addWord = () => {
    const value = word.trim()
    if (!value) return
    setWords((current) => [{ word: value, pronunciation: '', meaning: 'Chưa có nghĩa', example: '' }, ...current])
    setWord('')
  }

  const generateWords = async () => {
    if (!canUseAi(apiKey, provider)) return setError('Hãy lưu API key trước khi dùng tính năng AI.')
    setLoading(true)
    setError('')
    try {
      const result = parseAiJson(await requestAi(provider, apiKey, vocabularyPrompt(debouncedTopic), { json: true }))
      setWords((current) => [...(result.words || []), ...current])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <div className="space-y-6"><div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><section className="panel p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-okbg text-ok dark:bg-okdark dark:text-okfgdark"><Plus size={17} /></div><div><p className="eyebrow">Thêm nhanh</p><h2 className="font-display font-bold">Thêm từ mới</h2></div></div><div className="mt-5 flex gap-2"><input value={word} onChange={(event) => setWord(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addWord()} placeholder="Ví dụ: serendipity" className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none focus:border-ink/30 dark:border-white/[0.1]" /><button onClick={addWord} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-white dark:bg-lime dark:text-ink" aria-label="Thêm từ"><Plus size={17} /></button></div><div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/55"><span className="h-px flex-1 bg-ink/10 dark:bg-white/10" />Hoặc dùng AI<span className="h-px flex-1 bg-ink/10 dark:bg-white/10" /></div><FieldLabel>Chủ đề</FieldLabel><div className="flex gap-2"><input value={topic} onChange={(event) => setTopic(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]" /><button onClick={generateWords} disabled={loading} className="flex shrink-0 items-center gap-2 rounded-xl bg-lime px-3 text-sm font-bold text-ink disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <WandSparkles size={16} />}Sinh 5 từ</button></div></section><section className="panel p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Your library</p><h2 className="font-display font-bold">Từ vựng đã lưu</h2></div><span className="rounded-full bg-ink/[0.06] px-2.5 py-1 text-xs font-bold dark:bg-white/10">{words.length} từ</span></div>{words.length === 0 ? <div className="mt-8 rounded-xl bg-mist p-7 text-center dark:bg-[#29332f]"><BookOpen className="mx-auto text-ink/30 dark:text-white/30" size={24} /><p className="mt-3 text-sm font-semibold">Chưa có từ nào</p><p className="mt-1 text-xs text-ink/40 dark:text-white/40">Thêm thủ công hoặc để AI tạo bộ từ đầu tiên.</p></div> : <div className="mt-5 max-h-[430px] space-y-3 overflow-y-auto pr-1">{words.map((item, index) => <article key={`${item.word}-${index}`} className="rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]"><div className="flex items-start justify-between gap-3"><div><p className="font-display font-bold">{item.word}</p>{item.pronunciation && <p className="mt-0.5 text-xs text-sage">{item.pronunciation}</p>}</div><button onClick={() => setWords((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-ink/40 hover:text-danger dark:text-white/40" aria-label={`Xóa ${item.word}`}><Trash2 size={15} /></button></div><p className="mt-3 text-sm font-semibold">{item.meaning}</p>{item.example && <p className="mt-1 text-xs leading-5 text-ink/50 dark:text-white/50">“{item.example}”</p>}</article>)}</div>}</section></div>{error && <ErrorMessage message={error} />}</div>
}

export function WritingChecker({ apiKey }) {
  const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
  // Bản nháp và kết quả phân tích được lưu theo tài khoản để không mất khi đổi thiết bị.
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
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text])

  const checkGrammar = async () => {
    if (!canUseAi(apiKey, provider)) return setError('Hãy lưu API key trước khi dùng tính năng AI.')
    if (!debouncedText.trim()) return setError('Hãy nhập một đoạn văn để AI phân tích.')
    setLoading(true)
    setError('')
    try {
      setResult(parseAiJson(await requestAi(provider, apiKey, grammarPrompt(debouncedText), { json: true })))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <div className="space-y-6"><ModuleHero icon={PenLine} eyebrow="AI Writing Coach" title="Kiểm tra Writing thông minh" description="Viết đoạn văn của bạn, để AI tìm lỗi, giải thích và viết lại tự nhiên hơn." accent="#ff9600" deep="#b35c00" illustration="writing" stats={[{ label: 'Số từ', value: wordCount }, { label: 'Điểm AI', value: result?.score ?? '—' }, { label: 'Trạng thái', value: result ? 'Đã chấm' : 'Chờ nhập' }]} action="Chấm bài bằng AI" onAction={checkGrammar} actionDisabled={loading} /><div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><section className="panel p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Trợ lý viết</p><h2 className="mt-1 font-display text-lg font-bold">Viết đoạn văn</h2></div><span className="text-xs text-ink/35 dark:text-white/35">{wordCount} từ</span></div><textarea value={text} onChange={(event) => setText(event.target.value)} className="mt-6 min-h-[390px] w-full resize-none rounded-xl border border-ink/[0.1] bg-transparent p-4 text-sm leading-7 outline-none transition placeholder:text-ink/30 focus:border-ink/30 dark:border-white/[0.1] dark:placeholder:text-white/30" placeholder="Viết đoạn văn tiếng Anh của bạn..." /><button onClick={checkGrammar} disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white hover:bg-ink/90 disabled:cursor-wait disabled:opacity-60 dark:bg-lime dark:text-ink">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}AI Check</button>{error && <div className="mt-4"><ErrorMessage message={error} /></div>}</section><section className="panel min-h-[520px] p-5">{result ? <ResultView result={result} /> : <div className="grid min-h-[470px] place-items-center rounded-xl bg-mist p-8 text-center dark:bg-[#29332f]"><div><Sparkles className="mx-auto text-ink/25 dark:text-white/25" size={28} /><p className="mt-4 font-display font-bold">Kết quả phân tích sẽ xuất hiện ở đây</p><p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-ink/40 dark:text-white/40">AI sẽ tìm lỗi, viết lại đoạn văn tự nhiên hơn và giải thích bằng tiếng Việt.</p></div></div>}</section></div></div>
}

function ResultView({ result }) {
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef(null)
  // Dọn timer khi unmount / bấm Copy liên tiếp để trạng thái “Đã copy” không bị tắt sớm.
  useEffect(() => () => window.clearTimeout(copiedTimerRef.current), [])
  const copyText = async () => { await navigator.clipboard.writeText(result.rewritten || ''); setCopied(true); window.clearTimeout(copiedTimerRef.current); copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1600) }
  return <div><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Nhận xét AI</p><h2 className="mt-1 font-display text-lg font-bold">Kết quả phân tích</h2></div><div className="rounded-xl bg-lime px-3 py-2 text-center text-ink"><p className="font-display text-xl font-bold">{result.score ?? '--'}</p><p className="text-xs font-bold uppercase tracking-wide">điểm</p></div></div><div className="mt-5 rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]"><p className="text-sm leading-6 text-ink/65 dark:text-white/65">{result.summary}</p></div><div className="mt-6"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/45 dark:text-white/45"><AlertCircle size={14} />Lỗi cần lưu ý ({result.corrections?.length || 0})</p><div className="space-y-3">{result.corrections?.length ? result.corrections.map((item, index) => <div key={`${item.original}-${index}`} className="rounded-xl bg-dangerbg p-4 dark:bg-dangerdark"><p className="text-sm font-semibold text-danger line-through dark:text-dangerfgdark">{item.original}</p><p className="mt-1 text-sm font-bold text-ok dark:text-okfgdark">{item.corrected}</p><p className="mt-2 text-xs leading-5 text-ink/55 dark:text-white/55">{item.explanation}</p></div>) : <div className="flex items-center gap-2 rounded-xl bg-okbg p-4 text-sm font-semibold text-ok dark:bg-okdark dark:text-okfgdark"><CheckCircle2 size={16} />Không phát hiện lỗi rõ ràng.</div>}</div></div><div className="mt-6"><div className="mb-3 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/45 dark:text-white/45"><WandSparkles size={14} />Phiên bản tự nhiên hơn</p><button onClick={copyText} className="flex items-center gap-1.5 text-xs font-bold text-ink/45 hover:text-ink dark:text-white/45 dark:hover:text-white">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Đã copy' : 'Copy'}</button></div><p className="rounded-xl bg-mist p-4 text-sm leading-7 dark:bg-[#29332f]">{result.rewritten}</p></div></div>
}

function ErrorMessage({ message }) {
  return <div className="flex items-start gap-2 rounded-xl bg-dangerbg p-3 text-xs leading-5 text-danger dark:bg-dangerdark dark:text-dangerfgdark"><AlertCircle className="mt-0.5 shrink-0" size={15} />{message}</div>
}

