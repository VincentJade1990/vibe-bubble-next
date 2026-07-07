'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

/**
 * 随机灵感页面
 * 每次展示一个随机灵感，支持刷新
 */
export default function RandomPage() {
  const [inspiration, setInspiration] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchRandom = useCallback(async () => {
    setLoading(true)
    const supabase = await createClient()

    // 获取已发布的灵感总数
    const { count } = await supabase
      .from('inspirations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    if (!count) {
      setInspiration(null)
      setLoading(false)
      return
    }

    // 随机偏移
    const randomOffset = Math.floor(Math.random() * count)

    const { data } = await supabase
      .from('inspirations')
      .select('*')
      .eq('status', 'published')
      .range(randomOffset, randomOffset)
      .single()

    setInspiration(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRandom()
  }, [fetchRandom])

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#050a14]/60 border-b border-white/5">
        <Link href="/" className="text-lg font-semibold">Vibe Bubble</Link>
        <div className="flex gap-4 text-sm text-slate-400">
          <Link href="/gallery" className="hover:text-white transition">灵感库</Link>
          <Link href="/submit" className="hover:text-white transition">投稿</Link>
          <Link href="/profile" className="hover:text-white transition">个人中心</Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">随机灵感</h1>
            <p className="text-white/50">发现意想不到的创意</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-white/40">
              <div className="text-4xl mb-4 animate-spin inline-block">⚡</div>
              <p>加载中...</p>
            </div>
          ) : !inspiration ? (
            <div className="text-center py-20">
              <p className="text-white/50 mb-4">暂无灵感</p>
              <Link
                href="/gallery"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
              >
                去浏览灵感库
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 灵感卡片 */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                {inspiration.cover_image_url && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-slate-800">
                    <img
                      src={inspiration.cover_image_url}
                      alt={inspiration.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-3">{inspiration.title}</h2>

                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-slate-400">
                  {inspiration.source_platform && (
                    <span>来源: {inspiration.source_platform}</span>
                  )}
                  {inspiration.author_name && (
                    <span>作者: @{inspiration.author_name}</span>
                  )}
                  {inspiration.project_type && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">
                      {inspiration.project_type}
                    </span>
                  )}
                </div>

                {inspiration.summary && (
                  <p className="text-slate-300 leading-relaxed mb-4">{inspiration.summary}</p>
                )}

                {inspiration.tags && inspiration.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {inspiration.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>👁 {inspiration.view_count || 0}</span>
                  <span>❤️ {inspiration.like_count || 0}</span>
                  <span>⭐ {inspiration.favorite_count || 0}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4">
                <Link
                  href={`/inspiration/${inspiration.slug}`}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white text-center font-medium rounded-xl transition-colors"
                >
                  查看详情
                </Link>
                <button
                  onClick={fetchRandom}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-center font-medium rounded-xl transition-colors"
                >
                  🎲 换一个
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
