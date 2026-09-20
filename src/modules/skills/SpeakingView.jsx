import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleStop, Mic, Quote, Volume2 } from 'lucide-react'
import { speakingTopics } from '../../data/skills/speaking'
import { speakText, stopSpeech } from '../../utils/speech'
import { createRecognizer, isSpeechRecognitionSupported, scoreLabel, scorePronunciation, speedLabel } from '../../utils/speechScore'

const formatSeconds = (value) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`

/** Luyện nói B1: Part 1, cue card Part 2 có bài mẫu, thảo luận Part 3 và ghi âm để tự nghe lại. */
export default function SpeakingView({ focusId }) {
  const [topicId, setTopicId] = useState(speakingTopics[0].id)
  const [openSample, setOpenSample] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recStarting, setRecStarting] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')
  const [recError, setRecError] = useState('')
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [speechScore, setSpeechScore] = useState(null)
  const [speechError, setSpeechError] = useState('')

  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const recognizerRef = useRef(null)
  const listenStartedAt = useRef(0)
  const topic = speakingTopics.find((item) => item.id === topicId) || speakingTopics[0]

  // Câu mẫu dùng để chấm phát âm: câu hỏi Part 1, bài mẫu cue card và câu thảo luận Part 3.
  const practiceSentences = useMemo(() => [
    ...topic.warmUp.map((item) => ({ id: `w-${item.q}`, label: item.q, text: item.sample })),
    ...(topic.cue ? [{ id: 'cue', label: `Cue card: ${topic.cue.task}`, text: topic.cue.model }] : []),
    ...topic.discussion.map((item) => ({ id: `d-${item.q}`, label: item.q, text: item.sample })),
  ], [topic])
  const practice = practiceSentences[Math.min(practiceIndex, practiceSentences.length - 1)]

  useEffect(() => {
    setOpenSample(null)
    setRecError('')
    setPracticeIndex(0)
    setTranscript('')
    setSpeechScore(null)
    setSpeechError('')
    try { recognizerRef.current?.stop() } catch { /* bỏ qua */ }
    recognizerRef.current = null
    setListening(false)
    stopSpeech()
  }, [topic.id])

  useEffect(() => {
    if (focusId && speakingTopics.some((item) => item.id === focusId)) setTopicId(focusId)
  }, [focusId])

  useEffect(() => {
    if (!recording) return undefined
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [recording])

  // Dọn dẹp khi rời trang: ngừng ghi âm, ngừng nhận dạng, tắt micro, thu hồi blob.
  useEffect(() => () => {
    recorderRef.current?.state === 'recording' && recorderRef.current.stop()
    try { recognizerRef.current?.stop() } catch { /* bỏ qua */ }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startRecording = async () => {
    setRecError('')
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecError('Thiết bị/trình duyệt này không hỗ trợ ghi âm.')
      return
    }
    try {
      setRecStarting(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        setAudioUrl((current) => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(blob) })
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      recorder.start()
      recorderRef.current = recorder
      setSeconds(0)
      setRecording(true)
    } catch (error) {
      setRecError(error?.name === 'NotAllowedError' ? 'Bạn chưa cho phép dùng micro. Hãy bật quyền micro và thử lại.' : 'Không thể bắt đầu ghi âm trên thiết bị này.')
    } finally {
      setRecStarting(false)
    }
  }

  const stopRecording = () => {
    recorderRef.current?.state === 'recording' && recorderRef.current.stop()
    setRecording(false)
  }

  // --- Chấm điểm phát âm (Web Speech API, không cần server) ---------------
  const stopListening = () => {
    try { recognizerRef.current?.stop() } catch { /* bỏ qua */ }
    recognizerRef.current = null
    setListening(false)
  }

  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge (máy tính/Android).')
      return
    }
    stopSpeech()
    setSpeechError('')
    setTranscript('')
    setSpeechScore(null)
    const recognizer = createRecognizer({
      onPartial: (text) => setTranscript(text),
      onFinal: (text) => setTranscript((current) => `${current} ${text}`.trim()),
      onError: (error) => {
        setSpeechError(
          error === 'not-allowed'
            ? 'Bạn chưa cho phép dùng micro cho phần chấm phát âm.'
            : error === 'no-speech'
              ? 'Chưa nghe thấy gì. Thử lại và nói gần micro hơn.'
              : 'Không nhận dạng được giọng nói. Thử lại sau vài giây.',
        )
        setListening(false)
      },
      onEnd: () => setListening(false),
    })
    if (!recognizer) return
    recognizerRef.current = recognizer
    listenStartedAt.current = Date.now()
    try {
      recognizer.start()
      setListening(true)
    } catch {
      setSpeechError('Không thể bắt đầu nghe. Thử lại sau vài giây.')
      setListening(false)
    }
  }

  const finishListening = () => {
    stopListening()
    const seconds = Math.max(1, Math.round((Date.now() - listenStartedAt.current) / 1000))
    setSpeechScore(scorePronunciation(transcript, practice.text, seconds))
  }

  return (
    <div className="space-y-4">
      <nav className="panel p-3" aria-label="Danh sách chủ đề nói">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {speakingTopics.map((item) => {
            const active = item.id === topic.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTopicId(item.id)}
                aria-current={active ? 'true' : undefined}
                className={`flex min-h-[44px] min-w-max flex-col items-start rounded-xl px-3 py-2 text-left text-sm transition ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
              >
                <span className="font-bold">{item.title}</span>
                <span className={`text-xs ${active ? 'text-ink/70' : 'text-ink/60 dark:text-white/60'}`}>{item.topic}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Ghi âm luyện nói</p>
        <h3 className="mt-1 font-display text-lg font-bold">{topic.title}</h3>
        <p className="mt-1 text-xs text-ink/60 dark:text-white/60">Nói 1–2 phút, sau đó nghe lại và tự nhận xét: ngữ pháp, từ vựng, độ trôi chảy.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {recording
            ? <button type="button" onClick={stopRecording} className="btn-primary px-4"><CircleStop size={16} />Dừng ({formatSeconds(seconds)})</button>
            : <button type="button" onClick={startRecording} disabled={recStarting} className="btn-secondary px-4">{recStarting ? <><Mic size={16} />Đang xin quyền micro…</> : <><Mic size={16} />Bắt đầu ghi âm</>}</button>}
          {audioUrl && <audio controls src={audioUrl} className="h-11 w-full max-w-sm" />}
        </div>
        {recError && <p className="mt-2 text-xs text-danger dark:text-dangerfgdark">{recError}</p>}
      </section>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Chấm điểm phát âm</p>
            <h3 className="mt-1 font-display text-lg font-bold">Đọc to câu mẫu để xem điểm</h3>
            <p className="mt-1 text-xs leading-5 text-ink/60 dark:text-white/60">Trình duyệt nghe bạn đọc rồi so khớp với câu mẫu. Hoạt động tốt nhất trên Chrome/Edge.</p>
          </div>
          <select
            value={practiceIndex}
            onChange={(event) => {
              stopListening()
              setPracticeIndex(Number(event.target.value))
              setTranscript('')
              setSpeechScore(null)
              setSpeechError('')
            }}
            className="max-w-full rounded-xl border border-ink/10 bg-transparent px-3 py-2.5 text-xs font-bold outline-none dark:border-white/15"
            aria-label="Chọn câu mẫu để luyện"
          >
            {practiceSentences.map((item, index) => (
              <option key={item.id} value={index}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
          <p className="text-xs font-bold text-ink/60 dark:text-white/60">{practice.label}</p>
          <p className="mt-1.5 text-sm leading-6">{practice.text}</p>
          <button type="button" onClick={() => speakText(practice.text)} className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-sage">
            <Volume2 size={14} />Nghe mẫu
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {listening
            ? <button type="button" onClick={finishListening} className="btn-primary px-4"><CircleStop size={16} />Dừng &amp; chấm điểm</button>
            : <button type="button" onClick={startListening} className="btn-secondary px-4"><Mic size={16} />Bắt đầu đọc</button>}
          {(transcript || speechScore) && (
            <button type="button" onClick={() => { setTranscript(''); setSpeechScore(null); setSpeechError('') }} className="btn-ghost px-3 text-xs">Làm lại</button>
          )}
        </div>
        {speechError && <p className="mt-2 text-xs text-danger dark:text-dangerfgdark">{speechError}</p>}
        {transcript && (
          <p className="mt-3 rounded-xl bg-ink/[0.04] p-3 text-sm leading-6 dark:bg-white/[0.06]">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/50 dark:text-white/50">Bạn đọc: </span>
            {transcript}
          </p>
        )}
        {speechScore && (
          <div className="mt-4 rounded-xl border border-sage/40 bg-sage/10 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <p className="metric text-3xl">{speechScore.score}<span className="text-base">%</span></p>
              <div className="min-w-0">
                <p className="text-sm font-bold">{scoreLabel(speechScore.score)}</p>
                <p className="text-xs text-ink/60 dark:text-white/60">
                  Khớp {speechScore.matched}/{speechScore.total} từ
                  {speechScore.wpm ? ` · ${speechScore.wpm} từ/phút · ${speedLabel(speechScore.wpm)}` : ''}
                </p>
              </div>
            </div>
            {speechScore.missing.length > 0 && (
              <p className="mt-3 text-xs leading-5">
                Từ chưa nghe rõ: <span className="font-bold text-danger dark:text-dangerfgdark">{speechScore.missing.slice(0, 12).join(', ')}</span>
              </p>
            )}
          </div>
        )}
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Part 1 · Câu hỏi ngắn</p>
        <ul className="mt-3 space-y-2">
          {topic.warmUp.map((item) => (
            <li key={item.q} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold">{item.q}</p>
                <button type="button" onClick={() => setOpenSample(openSample === item.q ? null : item.q)} className="btn-ghost shrink-0 px-3">
                  {openSample === item.q ? 'Ẩn mẫu' : 'Xem mẫu'}
                </button>
              </div>
              {openSample === item.q && (
                <p className="mt-2 flex items-start gap-2 text-sm text-ink/80 dark:text-white/80">
                  <button type="button" onClick={() => speakText(item.sample)} className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink/60 hover:bg-ink/[0.06] dark:text-white/60 dark:hover:bg-white/10" aria-label="Nghe câu trả lời mẫu"><Volume2 size={14} /></button>
                  {item.sample}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Part 2 · Nói 1–2 phút</p>
        <h3 className="mt-1 font-display text-lg font-bold">{topic.cue.task}</h3>
        <ul className="mt-3 space-y-1.5 text-sm">
          {topic.cue.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 text-ink/70 dark:text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />{bullet}
            </li>
          ))}
        </ul>
        <div className="panel-flat mt-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-bold"><Quote size={15} className="text-sage" />Bài mẫu</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => speakText(topic.cue.model, { rate: 0.95 })} className="btn-secondary px-3"><Volume2 size={15} />Nghe</button>
              <button type="button" onClick={() => setOpenSample(openSample === 'cue' ? null : 'cue')} className="btn-ghost px-3">{openSample === 'cue' ? 'Ẩn' : 'Hiện'}</button>
            </div>
          </div>
          {openSample === 'cue' && <p className="mt-3 text-sm leading-7">{topic.cue.model}</p>}
        </div>
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Part 3 · Thảo luận</p>
        <ul className="mt-3 space-y-2">
          {topic.discussion.map((item) => (
            <li key={item.q} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold">{item.q}</p>
                <button type="button" onClick={() => setOpenSample(openSample === item.q ? null : item.q)} className="btn-ghost shrink-0 px-3">
                  {openSample === item.q ? 'Ẩn mẫu' : 'Xem mẫu'}
                </button>
              </div>
              {openSample === item.q && <p className="mt-2 text-sm leading-6 text-ink/80 dark:text-white/80">{item.sample}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Cụm từ nên dùng</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {topic.phrases.map((item) => (
            <li key={item.phrase} className="rounded-xl border border-ink/[0.08] p-3 text-sm dark:border-white/[0.08]">
              <span className="block font-semibold">{item.phrase}</span>
              <span className="mt-0.5 block text-xs text-ink/60 dark:text-white/60">{item.meaning}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
