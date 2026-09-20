import test from 'node:test'
import assert from 'node:assert/strict'
import { APP_URL_SCHEME } from '../src/services/googleAuthConfig.js'
import { appLinkFor, parseAppLink } from '../src/services/appLinks.js'

test('parseAppLink đọc link tab của widget/shortcut', () => {
  assert.deepEqual(parseAppLink(`${APP_URL_SCHEME}://tab/grammar`), {
    type: 'tab',
    tab: 'grammar',
    path: '/grammar',
    itemId: null,
  })
  assert.equal(parseAppLink(`${APP_URL_SCHEME}://tab/VSTEP`).path, '/vstep')
})

test('parseAppLink mặc định về tab Từ vựng khi thiếu tên tab', () => {
  assert.equal(parseAppLink(`${APP_URL_SCHEME}://tab`).path, '/vocabulary')
  assert.equal(parseAppLink(`${APP_URL_SCHEME}://tab/khong-ton-tai`).path, '/vocabulary')
})

test('parseAppLink đọc link mở đúng một bài (item)', () => {
  assert.deepEqual(parseAppLink(`${APP_URL_SCHEME}://grammar/present-simple`), {
    type: 'item',
    tab: 'grammar',
    path: '/grammar',
    itemId: 'present-simple',
  })
})

test('parseAppLink nhận diện link đăng nhập Google nhưng không xử lý như điều hướng', () => {
  assert.deepEqual(parseAppLink(`${APP_URL_SCHEME}://auth#id_token=abc`), { type: 'auth' })
})

test('parseAppLink trả null cho link ngoài app hoặc dữ liệu rỗng', () => {
  assert.equal(parseAppLink('https://example.com/tab/grammar'), null)
  assert.equal(parseAppLink(''), null)
  assert.equal(parseAppLink(undefined), null)
  assert.equal(parseAppLink(`${APP_URL_SCHEME}://`), null)
})

test('appLinkFor tạo link khớp với parseAppLink', () => {
  assert.equal(appLinkFor('grammar'), `${APP_URL_SCHEME}://tab/grammar`)
  assert.equal(parseAppLink(appLinkFor('progress')).path, '/progress')
})
