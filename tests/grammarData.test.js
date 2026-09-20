import test from 'node:test'
import assert from 'node:assert/strict'
import { grammarAllItems, grammarAllQuestions, grammarSections, grammarTopicCheatSheet, grammarQuestionById } from '../src/data/grammarIndex.js'
import { grammarConfusingPairs } from '../src/data/grammarConfusingPairs.js'
import { PASS_RATIO } from '../src/data/grammarCurriculum.js'

const ALLOWED_TYPES = ['choice', 'fill', 'error', 'transform']

test('chương trình ngữ pháp có 30 bài, chia đúng 4 nhóm và không trùng id/order', () => {
  assert.equal(grammarAllItems.length, 30)
  const ids = grammarAllItems.map((lesson) => lesson.id)
  assert.equal(new Set(ids).size, ids.length, 'id bài học bị trùng')
  const orders = grammarAllItems.map((lesson) => lesson.order)
  assert.equal(new Set(orders).size, orders.length, 'order bài học bị trùng')

  const sectionIds = grammarSections.flatMap((section) => section.items.map((item) => item.id))
  assert.equal(sectionIds.length, grammarAllItems.length, 'số bài trong các nhóm phải bằng tổng số bài')
  assert.equal(new Set(sectionIds).size, sectionIds.length, 'một bài bị nằm ở hai nhóm')
  assert.equal(PASS_RATIO, 0.8)
})

test('mọi bài đủ nội dung: cấu trúc, cách dùng, dấu hiệu, ví dụ, lỗi thường gặp', () => {
  for (const lesson of grammarAllItems) {
    assert.ok(lesson.title?.trim() && lesson.en?.trim() && lesson.summary?.trim(), `${lesson.id}: thiếu tiêu đề/tóm tắt`)
    assert.ok(lesson.forms?.length >= 3, `${lesson.id}: cần ít nhất 3 mục cấu trúc`)
    for (const form of lesson.forms) {
      assert.ok(form.label?.trim() && form.pattern?.trim() && form.example?.trim(), `${lesson.id}: form thiếu label/pattern/example`)
    }
    assert.ok(lesson.usage?.length >= 3, `${lesson.id}: cần ít nhất 3 cách dùng`)
    assert.ok(lesson.signals?.length >= 3, `${lesson.id}: cần ít nhất 3 dấu hiệu`)
    assert.ok(lesson.examples?.length >= 3, `${lesson.id}: cần ít nhất 3 ví dụ`)
    for (const example of lesson.examples) {
      assert.ok(example.en?.trim() && example.vi?.trim(), `${lesson.id}: ví dụ thiếu bản dịch`)
    }
    assert.ok(lesson.mistakes?.length >= 2, `${lesson.id}: cần ít nhất 2 lỗi thường gặp`)
    for (const mistake of lesson.mistakes) {
      assert.ok(mistake.wrong?.trim() && mistake.right?.trim() && mistake.note?.trim(), `${lesson.id}: lỗi thường gặp thiếu nội dung`)
    }
  }
})

test('mỗi bài có 8 câu hỏi hợp lệ với id duy nhất, đáp án và giải thích đầy đủ', () => {
  for (const lesson of grammarAllItems) {
    assert.equal(lesson.questions.length, 8, `${lesson.id}: phải có đúng 8 câu`)
    for (const question of lesson.questions) {
      assert.ok(question.id?.startsWith(`${lesson.id}-q`), `${lesson.id}: id câu hỏi sai định dạng`)
      assert.equal(question.lessonId, lesson.id)
      assert.ok(ALLOWED_TYPES.includes(question.type), `${lesson.id}/${question.id}: loại câu hỏi lạ (${question.type})`)
      assert.ok(question.prompt?.trim(), `${lesson.id}/${question.id}: thiếu prompt`)
      assert.ok(question.explain?.trim(), `${lesson.id}/${question.id}: thiếu giải thích`)
      if (question.type === 'choice') {
        assert.ok(question.options?.length >= 3, `${lesson.id}/${question.id}: thiếu lựa chọn`)
        assert.ok(question.options.includes(question.answer), `${lesson.id}/${question.id}: đáp án không nằm trong options`)
        assert.equal(new Set(question.options).size, question.options.length, `${lesson.id}/${question.id}: lựa chọn bị trùng`)
      } else {
        assert.ok(question.answers?.length > 0, `${lesson.id}/${question.id}: thiếu answers`)
        for (const answer of question.answers) {
          assert.equal(answer, answer.toLowerCase(), `${lesson.id}/${question.id}: đáp án nên viết thường`)
          assert.ok(!/[.!?]$/.test(answer), `${lesson.id}/${question.id}: đáp án không nên có dấu câu ở cuối`)
        }
      }
      if (question.type === 'error' || question.type === 'transform') {
        assert.ok(question.hint?.trim(), `${lesson.id}/${question.id}: dạng ${question.type} cần hint`)
      }
    }
  }
})

test('id câu hỏi là duy nhất trên toàn bộ chương trình và tra cứu được theo id', () => {
  const ids = grammarAllQuestions.map((question) => question.id)
  assert.equal(ids.length, grammarAllItems.length * 8)
  assert.equal(new Set(ids).size, ids.length, 'id câu hỏi bị trùng giữa các bài')
  const sample = grammarAllQuestions[0]
  assert.equal(grammarQuestionById(sample.id)?.prompt, sample.prompt)
  assert.equal(grammarQuestionById('khong-ton-tai'), null)
})

test('các chủ điểm mới đã có mặt: giới từ, liên từ, used to, câu hỏi đuôi, cấu tạo từ, C1', () => {
  const required = [
    'prepositions',
    'linking-words',
    'used-to',
    'question-tags',
    'word-formation',
    'wish-causative',
    'cleft-sentences',
    'inversion',
    'participle-clauses',
    'nominalisation-hedging',
  ]
  const ids = new Set(grammarAllItems.map((lesson) => lesson.id))
  required.forEach((id) => assert.ok(ids.has(id), `thiếu bài ${id}`))
})

test('bảng tra nhanh chủ điểm phủ hết 18 chủ điểm ngoài 12 thì', () => {
  assert.equal(grammarTopicCheatSheet.length, 18)
  for (const row of grammarTopicCheatSheet) {
    assert.ok(row.pattern?.trim(), `${row.id}: thiếu cấu trúc mẫu`)
    assert.ok(row.example?.trim(), `${row.id}: thiếu ví dụ`)
    assert.ok(['B1', 'Mở rộng', 'C1'].includes(row.group), `${row.id}: nhóm không hợp lệ`)
  }
})

test('bảng cặp cấu trúc dễ lẫn đầy đủ và không trùng id', () => {
  assert.ok(grammarConfusingPairs.length >= 12, 'cần ít nhất 12 cặp cấu trúc')
  const ids = grammarConfusingPairs.map((pair) => pair.id)
  assert.equal(new Set(ids).size, ids.length, 'id cặp cấu trúc bị trùng')
  for (const pair of grammarConfusingPairs) {
    assert.ok(pair.left?.trim() && pair.right?.trim(), `${pair.id}: thiếu vế so sánh`)
    assert.ok(pair.point?.trim().length > 20, `${pair.id}: cách phân biệt quá ngắn`)
    assert.ok(pair.example?.trim(), `${pair.id}: thiếu ví dụ`)
  }
})
