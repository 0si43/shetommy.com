import { describe, it, expect } from 'vitest'

// mapLanguage は内部関数なので、export されていない。
// テスト可能な形として、notionLangMap の変換ロジックをここで再現してテストする
const notionLangMap: Record<string, string> = {
  'plain text': 'text',
  'c++': 'cpp',
  'c#': 'csharp',
  'f#': 'fsharp',
  'java/c/c++/c#': 'java',
  'objective-c': 'objectivec',
  'vb.net': 'vbnet',
  'visual basic': 'visual-basic',
  'shell': 'bash',
  'docker': 'docker',
  'webassembly': 'wasm',
}

const mapLanguage = (lang: string): string => notionLangMap[lang] ?? lang

describe('mapLanguage', () => {
  it('マッピングが定義された言語を変換する', () => {
    expect(mapLanguage('plain text')).toBe('text')
    expect(mapLanguage('c++')).toBe('cpp')
    expect(mapLanguage('c#')).toBe('csharp')
    expect(mapLanguage('shell')).toBe('bash')
    expect(mapLanguage('webassembly')).toBe('wasm')
  })

  it('マッピングがない言語はそのまま返す', () => {
    expect(mapLanguage('typescript')).toBe('typescript')
    expect(mapLanguage('javascript')).toBe('javascript')
    expect(mapLanguage('python')).toBe('python')
  })
})
