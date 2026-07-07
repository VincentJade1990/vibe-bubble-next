'use client'

import { useState, useEffect } from 'react'
import { getAllInspirations, deleteInspiration, publishInspiration } from '@/app/actions/inspirations'

/**
 * 灵感库管理页面
 */
export default function InspirationsPage() {
  const [inspirations, setInspirations] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    setIsLoading(true)
    try {
      const { data } = await getAllInspirations()
      setInspirations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = inspirations.filter((i: any) => {
    if (status && i.status !== status) return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleDelete(id: string) {
    const result = await deleteInspiration(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '删除失败')
    }
  }

  async function handlePublish(id: string) {
    const result = await publishInspiration(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '发布失败')
    }
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-yellow-500/20 text-yellow-300' },
    published: { label: '已发布', color: 'bg-green-500/20 text-green-300' },
    archived: { label: '已归档', color: 'bg-gray-500/20 text-gray-300' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">灵感库</h1><p className="text-white/50">管理灵感内容</p></div>
      </div>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="搜索..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
          <option value="">全部状态</option><option value="draft">草稿</option><option value="published">已发布</option><option value="archived">已归档</option>
        </select>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center py-12 text-white/40">加载中...</p>
        ) : (
          <>
            {filtered.map((inspiration: any) => (
              <div key={inspiration.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white truncate">{inspiration.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusMap[inspiration.status]?.color}`}>{statusMap[inspiration.status]?.label}</span>
                    </div>
                    <p className="text-sm text-white/50 line-clamp-2 mb-2">{inspiration.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>{inspiration.source_platform}</span><span>❤️ {inspiration.like_count ?? 0}</span><span>⭐ {inspiration.favorite_count ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={`/inspiration/${inspiration.slug}`} target="_blank" className="px-3 py-1.5 text-xs bg-white/5 text-white/60 border border-white/10 rounded-lg hover:bg-white/10">查看</a>
                    {inspiration.status === 'draft' && <button onClick={() => handlePublish(inspiration.id)} className="px-3 py-1.5 text-xs bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/30">发布</button>}
                    <button onClick={() => handleDelete(inspiration.id)} className="px-3 py-1.5 text-xs bg-red-600/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-600/20">删除</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center py-12 text-white/40">暂无数据</p>}
          </>
        )}
      </div>
    </div>
  )
}
