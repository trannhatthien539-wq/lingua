import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  LoaderCircle,
  Plus,
  Send,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react'
import { parseAiJson, requestAi } from '../../services/aiClient'

const API_KEY_STORAGE = 'lingua-ai-api-key'
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

export function VocabularyHub() {
  const apiKey = localStorage.getItem(API_KEY_STORAGE) || ''
  const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
  const [topic, setTopic] = useState('Du lịch')
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
    if (!apiKey) return setError('Hãy lưu API key trước khi dùng tính năng AI.')
    setLoading(true)
    setError('')
    try {
      const result = parseAiJson(await requestAi(provider, apiKey, vocabularyPrompt(topic), { json: true }))
      setWords((current) => [...(result.words || []), ...current])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <div className="space-y-6"><div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><section className="panel p-5"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#e5f0e5] text-[#568460] dark:bg-[#2c4233] dark:text-[#a9d5af]"><Plus size={17} /></div><div><p className="eyebrow">Quick add</p><h2 className="font-display font-bold">Thêm từ mới</h2></div></div><div className="mt-5 flex gap-2"><input value={word} onChange={(event) => setWord(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addWord()} placeholder="Ví dụ: serendipity" className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none focus:border-ink/30 dark:border-white/[0.1]" /><button onClick={addWord} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-white dark:bg-lime dark:text-ink" aria-label="Thêm từ"><Plus size={17} /></button></div><div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-ink/30 dark:text-white/30"><span className="h-px flex-1 bg-ink/10 dark:bg-white/10" />Hoặc dùng AI<span className="h-px flex-1 bg-ink/10 dark:bg-white/10" /></div><FieldLabel>Chủ đề</FieldLabel><div className="flex gap-2"><input value={topic} onChange={(event) => setTopic(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]" /><button onClick={generateWords} disabled={loading} className="flex shrink-0 items-center gap-2 rounded-xl bg-lime px-3 text-sm font-bold text-ink disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <WandSparkles size={16} />}Sinh 5 từ</button></div></section><section className="panel p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Your library</p><h2 className="font-display font-bold">Từ vựng đã lưu</h2></div><span className="rounded-full bg-ink/[0.06] px-2.5 py-1 text-xs font-bold dark:bg-white/10">{words.length} từ</span></div>{words.length === 0 ? <div className="mt-8 rounded-xl bg-mist p-7 text-center dark:bg-[#29332f]"><BookOpen className="mx-auto text-ink/30 dark:text-white/30" size={24} /><p className="mt-3 text-sm font-semibold">Chưa có từ nào</p><p className="mt-1 text-xs text-ink/40 dark:text-white/40">Thêm thủ công hoặc để AI tạo bộ từ đầu tiên.</p></div> : <div className="mt-5 max-h-[430px] space-y-3 overflow-y-auto pr-1">{words.map((item, index) => <article key={`${item.word}-${index}`} className="rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]"><div className="flex items-start justify-between gap-3"><div><p className="font-display font-bold">{item.word}</p>{item.pronunciation && <p className="mt-0.5 text-xs text-sage">{item.pronunciation}</p>}</div><button onClick={() => setWords((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-ink/25 hover:text-red-500 dark:text-white/25" aria-label={`Xóa ${item.word}`}><Trash2 size={15} /></button></div><p className="mt-3 text-sm font-semibold">{item.meaning}</p>{item.example && <p className="mt-1 text-xs leading-5 text-ink/50 dark:text-white/50">“{item.example}”</p>}</article>)}</div>}</section></div>{error && <ErrorMessage message={error} />}</div>
}

export function GrammarChecker() {
  const apiKey = localStorage.getItem(API_KEY_STORAGE) || ''
  const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
  const [text, setText] = useState(defaultText)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text])

  const checkGrammar = async () => {
    if (!apiKey) return setError('Hãy lưu API key trước khi dùng tính năng AI.')
    if (!text.trim()) return setError('Hãy nhập một đoạn văn để AI phân tích.')
    setLoading(true)
    setError('')
    try {
      setResult(parseAiJson(await requestAi(provider, apiKey, grammarPrompt(text), { json: true })))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"><section className="panel p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Writing assistant</p><h2 className="mt-1 font-display text-lg font-bold">Viết đoạn văn</h2></div><span className="text-xs text-ink/35 dark:text-white/35">{wordCount} từ</span></div><textarea value={text} onChange={(event) => setText(event.target.value)} className="mt-6 min-h-[390px] w-full resize-none rounded-xl border border-ink/[0.1] bg-transparent p-4 text-sm leading-7 outline-none transition placeholder:text-ink/30 focus:border-ink/30 dark:border-white/[0.1] dark:placeholder:text-white/30" placeholder="Viết đoạn văn tiếng Anh của bạn..." /><button onClick={checkGrammar} disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white hover:bg-ink/90 disabled:cursor-wait disabled:opacity-60 dark:bg-lime dark:text-ink">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}AI Check</button>{error && <div className="mt-4"><ErrorMessage message={error} /></div>}</section><section className="panel min-h-[520px] p-5">{result ? <ResultView result={result} /> : <div className="grid min-h-[470px] place-items-center rounded-xl bg-mist p-8 text-center dark:bg-[#29332f]"><div><Sparkles className="mx-auto text-ink/25 dark:text-white/25" size={28} /><p className="mt-4 font-display font-bold">Kết quả phân tích sẽ xuất hiện ở đây</p><p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-ink/40 dark:text-white/40">AI sẽ tìm lỗi, viết lại đoạn văn tự nhiên hơn và giải thích bằng tiếng Việt.</p></div></div>}</section></div>
}

function ResultView({ result }) {
  const [copied, setCopied] = useState(false)
  const copyText = async () => { await navigator.clipboard.writeText(result.rewritten || ''); setCopied(true); setTimeout(() => setCopied(false), 1600) }
  return <div><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">AI feedback</p><h2 className="mt-1 font-display text-lg font-bold">Kết quả phân tích</h2></div><div className="rounded-xl bg-lime px-3 py-2 text-center text-ink"><p className="font-display text-xl font-bold">{result.score ?? '--'}</p><p className="text-[10px] font-bold uppercase tracking-wider">điểm</p></div></div><div className="mt-5 rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]"><p className="text-sm leading-6 text-ink/65 dark:text-white/65">{result.summary}</p></div><div className="mt-6"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/45 dark:text-white/45"><AlertCircle size={14} />Lỗi cần lưu ý ({result.corrections?.length || 0})</p><div className="space-y-3">{result.corrections?.length ? result.corrections.map((item, index) => <div key={`${item.original}-${index}`} className="rounded-xl bg-[#fff1ed] p-4 dark:bg-[#402c29]"><p className="text-sm font-semibold text-red-700 line-through dark:text-red-200">{item.original}</p><p className="mt-1 text-sm font-bold text-[#568460] dark:text-[#a9d5af]">{item.corrected}</p><p className="mt-2 text-xs leading-5 text-ink/55 dark:text-white/55">{item.explanation}</p></div>) : <div className="flex items-center gap-2 rounded-xl bg-[#e6f3e8] p-4 text-sm font-semibold text-[#568460] dark:bg-[#293f31] dark:text-[#a9d5af]"><CheckCircle2 size={16} />Không phát hiện lỗi rõ ràng.</div>}</div></div><div className="mt-6"><div className="mb-3 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/45 dark:text-white/45"><WandSparkles size={14} />Phiên bản tự nhiên hơn</p><button onClick={copyText} className="flex items-center gap-1.5 text-xs font-bold text-ink/45 hover:text-ink dark:text-white/45 dark:hover:text-white">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Đã copy' : 'Copy'}</button></div><p className="rounded-xl bg-mist p-4 text-sm leading-7 dark:bg-[#29332f]">{result.rewritten}</p></div></div>
}

function ErrorMessage({ message }) {
  return <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700 dark:bg-red-950/30 dark:text-red-200"><AlertCircle className="mt-0.5 shrink-0" size={15} />{message}</div>
}

