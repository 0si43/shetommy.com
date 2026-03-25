import { describe, it, expect } from 'vitest'
import {
  sanitizeForUrl,
  getPageTitle,
  getPageDate,
  isPublishDate,
  filterPages,
  type NotionPage,
} from '../components/Notion'

// テスト用のNotionPageモックを作成するヘルパー
const createMockPage = (overrides: Partial<Record<string, unknown>> = {}): NotionPage => ({
  object: 'page',
  id: 'test-id',
  created_time: '2024-01-01T00:00:00.000Z',
  last_edited_time: '2024-01-02T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-id' },
  last_edited_by: { object: 'user', id: 'user-id' },
  cover: null,
  icon: null,
  parent: { type: 'database_id', database_id: 'db-id' },
  archived: false,
  url: 'https://www.notion.so/test',
  properties: {
    Name: {
      id: 'title',
      type: 'title',
      title: [{ plain_text: 'Test Article', type: 'text', text: { content: 'Test Article', link: null }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
    },
    'publish date': {
      id: 'pub',
      type: 'date',
      date: { start: '2024-03-01', end: null, time_zone: null },
    },
    ...overrides,
  },
} as unknown as NotionPage)

describe('sanitizeForUrl', () => {
  it('URLに使えない文字を除去する', () => {
    expect(sanitizeForUrl('Hello?World')).toBe('HelloWorld')
    expect(sanitizeForUrl('test#anchor')).toBe('testanchor')
    expect(sanitizeForUrl('path/to/page')).toBe('pathtopage')
    expect(sanitizeForUrl('a&b')).toBe('ab')
    expect(sanitizeForUrl('100%')).toBe('100')
  })

  it('問題のない文字列はそのまま返す', () => {
    expect(sanitizeForUrl('Hello World')).toBe('Hello World')
    expect(sanitizeForUrl('TypeScript入門')).toBe('TypeScript入門')
  })
})

describe('getPageTitle', () => {
  it('タイトルを返す', () => {
    const page = createMockPage()
    expect(getPageTitle(page)).toBe('Test Article')
  })

  it('タイトルが空の場合は空文字を返す', () => {
    const page = createMockPage({
      Name: { id: 'title', type: 'title', title: [] },
    })
    expect(getPageTitle(page)).toBe('')
  })
})

describe('getPageDate', () => {
  it('publish dateが設定されている場合はその日付を返す', () => {
    const page = createMockPage()
    const date = getPageDate(page)
    expect(date.toISOString().startsWith('2024-03-01')).toBe(true)
  })

  it('publish dateがnullの場合はlast_edited_timeを返す', () => {
    const page = createMockPage({
      'publish date': { id: 'pub', type: 'date', date: null },
    })
    const date = getPageDate(page)
    expect(date.toISOString().startsWith('2024-01-02')).toBe(true)
  })
})

describe('isPublishDate', () => {
  it('publish dateが設定されている場合はtrueを返す', () => {
    const page = createMockPage()
    expect(isPublishDate(page)).toBe(true)
  })

  it('publish dateがnullの場合はfalseを返す', () => {
    const page = createMockPage({
      'publish date': { id: 'pub', type: 'date', date: null },
    })
    expect(isPublishDate(page)).toBe(false)
  })
})

describe('filterPages', () => {
  it('publish dateプロパティがnullのページを除外する', () => {
    // filterPagesは page.properties['publish date'] !== null をチェックする
    // プロパティ自体がnullの場合のみフィルタアウトされる
    const pages = [
      createMockPage(),
      createMockPage({ 'publish date': null }),
      createMockPage(),
    ]
    const result = filterPages(pages)
    expect(result).toHaveLength(2)
  })

  it('全ページがpublish dateを持つ場合は全件返す', () => {
    const pages = [createMockPage(), createMockPage()]
    const result = filterPages(pages)
    expect(result).toHaveLength(2)
  })
})
