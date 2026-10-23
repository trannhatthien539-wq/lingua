import test from 'node:test'
import assert from 'node:assert/strict'
import { loadThemeDeckEntries, themeDeckMeta } from '../src/data/themeDecks.js'

const essentialDeckIds = ['essential_vocab_1', 'essential_vocab_2', 'essential_vocab_3']

test('ba phần từ vựng có đủ 4.000 mục duy nhất mỗi phần và 12.000 mục tổng cộng', async () => {
  const entryGroups = await Promise.all(essentialDeckIds.map((deckId) => loadThemeDeckEntries(deckId)))
  const allEntries = entryGroups.flatMap((entries, index) => {
    const deckId = essentialDeckIds[index]
    assert.equal(entries.length, 4000, `${deckId} phải có đúng 4.000 từ`)
    assert.equal(new Set(entries.map((entry) => entry.word.toLowerCase())).size, 4000, `${deckId} có từ bị lặp`)
    assert.ok(entries.every((entry) => entry.word && entry.meaning), `${deckId} có mục thiếu từ hoặc nghĩa`)
    assert.ok(entries.every((entry) => !entry.meaning.includes('[[')), `${deckId} còn markup từ điển`)
    return entries
  })

  assert.equal(new Set(allEntries.map((entry) => entry.word.toLowerCase())).size, 12000, 'ba phần phải có 12.000 từ duy nhất')
})

test('ba bộ 4.000 từ được xếp theo đúng cấp độ tăng dần', () => {
  assert.deepEqual(
    essentialDeckIds.map((deckId) => themeDeckMeta(deckId).level),
    ['A2-B1', 'B1-B2', 'B2-C1'],
  )
})
