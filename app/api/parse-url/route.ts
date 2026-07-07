import { NextRequest, NextResponse } from 'next/server'

/**
 * URL 解析 API
 * 解析外部链接获取元数据（标题、描述、图片等）
 * 用于后台添加候选时自动填充信息
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: '缺少 URL 参数' }, { status: 400 })
    }

    // 使用 fetch 获取页面 HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      // 设置超时
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `请求失败: ${response.status}` },
        { status: 502 }
      )
    }

    const html = await response.text()

    // 解析 OG 标签和基本元数据
    const title = extractMeta(html, 'og:title') ||
      extractTag(html, '<title>', '</title>') ||
      ''

    const description = extractMeta(html, 'og:description') ||
      extractMeta(html, 'description') ||
      ''

    const image = extractMeta(html, 'og:image') ||
      extractMeta(html, 'twitter:image') ||
      ''

    const siteName = extractMeta(html, 'og:site_name') ||
      new URL(url).hostname

    return NextResponse.json({
      success: true,
      data: {
        title: title.slice(0, 200),
        description: description.slice(0, 500),
        image: image.slice(0, 500),
        siteName,
        url,
      },
    })
  } catch (error: any) {
    console.error('URL 解析失败:', error)
    return NextResponse.json(
      { error: `解析失败: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * 从 HTML 中提取 meta 标签内容
 */
function extractMeta(html: string, property: string): string {
  // 匹配 og:xxx 格式
  const ogRegex = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    'i'
  )
  const ogMatch = html.match(ogRegex)
  if (ogMatch) return ogMatch[1]

  // 匹配 name=xxx 格式
  const nameRegex = new RegExp(
    `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
    'i'
  )
  const nameMatch = html.match(nameRegex)
  if (nameMatch) return nameMatch[1]

  // 反向匹配 content 在前的情况
  const reverseRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    'i'
  )
  const reverseMatch = html.match(reverseRegex)
  if (reverseMatch) return reverseMatch[1]

  return ''
}

/**
 * 从 HTML 中提取标签内容
 */
function extractTag(html: string, open: string, close: string): string {
  const start = html.indexOf(open)
  if (start === -1) return ''
  const end = html.indexOf(close, start + open.length)
  if (end === -1) return ''
  return html.slice(start + open.length, end).trim()
}
