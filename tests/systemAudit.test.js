import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { navigationItems } from '../src/data/navigation.js'

describe('Hệ thống SEO, Metadata và Cấu trúc dự án', () => {
  it('robots.txt tồn tại và có chỉ thị hợp lệ', () => {
    const robotsPath = path.resolve('public/robots.txt')
    assert.ok(fs.existsSync(robotsPath), 'public/robots.txt phải tồn tại')
    const content = fs.readFileSync(robotsPath, 'utf8')
    assert.match(content, /User-agent:\s*\*/i)
    assert.match(content, /Disallow:\s*\/settings/i)
    assert.match(content, /Disallow:\s*\/login/i)
    assert.match(content, /Sitemap:\s*https?:\/\//i)
  })

  it('sitemap.xml tồn tại và chứa các route học tập chính', () => {
    const sitemapPath = path.resolve('public/sitemap.xml')
    assert.ok(fs.existsSync(sitemapPath), 'public/sitemap.xml phải tồn tại')
    const content = fs.readFileSync(sitemapPath, 'utf8')
    assert.ok(content.startsWith('<?xml'), 'Phải có khai báo XML')
    assert.match(content, /<loc>https?:\/\/.*?\/home<\/loc>/)
    assert.match(content, /<loc>https?:\/\/.*?\/vocabulary<\/loc>/)
    assert.match(content, /<loc>https?:\/\/.*?\/grammar<\/loc>/)
    assert.match(content, /<loc>https?:\/\/.*?\/skills<\/loc>/)
    assert.match(content, /<loc>https?:\/\/.*?\/vstep<\/loc>/)
  })

  it('index.html có canonical URL và schema.org JSON-LD hợp lệ', () => {
    const htmlPath = path.resolve('index.html')
    const content = fs.readFileSync(htmlPath, 'utf8')
    assert.match(content, /<link\s+rel="canonical"\s+href="https?:\/\/.*?"\s*\/?>/i)
    assert.match(content, /application\/ld\+json/)
    const jsonMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    assert.ok(jsonMatch, 'Phải có thẻ JSON-LD')
    const parsed = JSON.parse(jsonMatch[1])
    assert.equal(parsed['@type'], 'WebApplication')
    assert.ok(parsed.name.includes('Lingua'))
  })

  it('index.html có prefetch DNS và preconnect cho fonts và services', () => {
    const htmlPath = path.resolve('index.html')
    const content = fs.readFileSync(htmlPath, 'utf8')
    assert.match(content, /<link\s+rel="dns-prefetch"\s+href="https:\/\/fonts\.googleapis\.com"\s*\/?>/i)
    assert.match(content, /<link\s+rel="dns-prefetch"\s+href="https:\/\/fonts\.gstatic\.com"\s*\/?>/i)
  })

  it('Service Worker đệm Google Fonts và có phiên bản cache hiện tại', () => {
    const swPath = path.resolve('public/sw.js')
    assert.ok(fs.existsSync(swPath), 'public/sw.js phải tồn tại')
    const content = fs.readFileSync(swPath, 'utf8')
    assert.match(content, /lingua-static-v8/)
    assert.match(content, /fonts\.gstatic\.com/)
    assert.match(content, /fonts\.googleapis\.com/)
  })

  it('manifest.json có đầy đủ icon any và maskable adaptive không viền trắng', () => {
    const manifestPath = path.resolve('public/manifest.json')
    assert.ok(fs.existsSync(manifestPath), 'manifest.json phải tồn tại')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    assert.equal(manifest.background_color, '#0B0F17')
    assert.equal(manifest.theme_color, '#0B0F17')
    const purposes = manifest.icons.map((i) => i.purpose)
    assert.ok(purposes.includes('any'), 'Cần có icon purpose any')
    assert.ok(purposes.includes('maskable'), 'Cần có icon purpose maskable')
    for (const icon of manifest.icons) {
      const p = path.resolve('public', icon.src.replace(/^\.\//, ''))
      assert.ok(fs.existsSync(p), `Icon file ${p} phải tồn tại`)
    }
  })

  it('navigationItems có đủ 10 module, không trùng id và đủ nhãn', () => {
    assert.equal(navigationItems.length, 10)
    const ids = navigationItems.map((item) => item.id)
    const uniqueIds = new Set(ids)
    assert.equal(uniqueIds.size, ids.length, 'Không được trùng ID điều hướng')
    for (const item of navigationItems) {
      assert.ok(item.id, 'Phải có id')
      assert.ok(item.label, 'Phải có label')
      assert.ok(item.color, 'Phải có color')
      assert.ok(item.icon, 'Phải có icon')
    }
  })
})
