'use client'

import { useState, useEffect } from 'react'
import { getCandidates, approveCandidate, rejectCandidate, deleteCandidate } from '@/app/actions/candidates'

/**
 * 候选池管理页面
 */
export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    setIsLoading(true)
    try {
      const { data } = await getCandidates()
      setCandidates(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = candidates.filter((c: any) => {
    if (status && c.review_status !== status) return false
    if (search && !c.title?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleApprove(id: string) {
    const result = await approveCandidate(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '操作失败')
    }
  }

  async function handleReject(id: string) {
    const result = await rejectCandidate(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '操作失败')
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteCandidate(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '删除失败')
    }
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'bg-yellow-500/20 text-yellow-300' },
    approved: { label: '已通过', color: 'bg-green-500/20 text-green-300' },
    rejected: { label: '已拒绝', color: 'bg-red-500/20 text-red-300' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">候选池</h1><p className="text-white/50">管理灵感候选</p></div>
      </div>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="搜索..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
          <option value="">全部状态</option><option value="pending">待审核</option><option value="approved">已通过</option><option value="rejected">已拒绝</option>
        </select>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center py-12 text-white/40">加载中...</p>
        ) : (
          <>
            {filtered.map((candidate: any) => (
              <div key={candidate.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white truncate">{candidate.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusMap[candidate.review_status]?.color}`}>{statusMap[candidate.review_status]?.label}</span>
                    </div>
                    <p className="text-sm text-white/50 line-clamp-2 mb-2">{candidate.raw_text}</p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>{candidate.source_platform}</span>
                      {candidate.author_name && <span>@{candidate.author_name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {candidate.review_status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(candidate.id)} className="px-3 py-1.5 text-xs bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/30">通过</button>
                        <button onClick={() => handleReject(candidate.id)} className="px-3 py-1.5 text-xs bg-red-600/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-600/30">拒绝</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(candidate.id)} className="px-3 py-1.5 text-xs bg-red-600/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-600/20">删除</button>
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
