import { useState } from 'react'
import { LoaderCircle, Sparkles } from 'lucide-react'
import { requestAi } from '../../services/aiService'
import { toast } from '../../services/toast'

/**
 * Nút "Giải thích bằng AI" cho một câu hỏi ngữ pháp đã làm sai.
 * Dùng chung API key/provider với các tính năng AI khác trong app.
 */
export default function AiExplainButton({ question, response, apiKey, provider = 'gemini' }) {
  const [state, setState] = useState({ loading: false, text: '' })

  const explain = async () => {
    if (!apiKey?.trim()) {
      toast.error('Hãy lưu API key ở Cài đặt → Kết nối AI để dùng tính năng này.')
      return
    }
    const correct = question.type === 'choice' ? question.answer : (question.answers || []).join(' / ')
    setState({ loading: true, text: '' })
    try {
      const prompt = [
        'Bạn là giáo viên tiếng Anh đang chữa bài cho học viên người Việt (trình độ B1–C1).',
        `Câu hỏi: ${question.prompt}`,
        `Đáp án đúng: ${correct}`,
        `Học viên trả lời: ${response || '(bỏ trống)'}`,
        'Hãy giải thích gồm 4 ý, dùng gạch đầu dòng, tiếng Việt:',
        '(1) vì sao đáp án đúng là như vậy, (2) học viên sai ở điểm nào, (3) quy tắc ngắn gọn dễ nhớ, (4) hai ví dụ tương tự (tiếng Anh kèm nghĩa tiếng Việt).',
        'Tối đa 150 từ, không markdown phức tạp.',
      ].join('\n')
      const text = await requestAi(provider, apiKey, prompt)
      setState({ loading: false, text })
    } catch (error) {
      setState({ loading: false, text: '' })
      toast.error(error.message || 'Không thể hỏi AI lúc này.')
    }
  }

  return (
    <div className="mt-2 pl-6">
      <button type="button" onClick={explain} disabled={state.loading} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-ink/10 px-2.5 text-xs font-bold text-ink/70 transition hover:bg-ink/[0.05] disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10">
        {state.loading ? <LoaderCircle size={13} className="animate-spin" /> : <Sparkles size={13} />}
        {state.loading ? 'Đang hỏi AI…' : 'Giải thích bằng AI'}
      </button>
      {state.text && (
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-sage/10 p-3 text-xs leading-5">{state.text}</p>
      )}
    </div>
  )
}
