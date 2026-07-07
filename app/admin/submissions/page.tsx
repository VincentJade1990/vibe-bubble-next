'use client'

import { useState, useEffect } from 'react'
import { getSubmissions, approveSubmission, rejectSubmission, deleteSubmission } from '@/app/actions/submissions'

/**
 * 投稿管理后台页面
 */
export default function SubmissionsAdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    setIsLoading(true)
    try {
      const { data } = await getSubmissions()
      setSubmissions(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = submissions.filter((s: any) => {
    if (status && s.status !== status) return false
    return true
  })

  async function handleApprove(id: string) {
    const result = await approveSubmission(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '操作失败')
    }
  }

  async function handleReject(id: string) {
    const result = await rejectSubmission(id)
    if (result.success) {
      await loadData()
    } else {
      alert(result.error || '操作失败')
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteSubmission(id)
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
      <div className="mb-6"><h1 className="text-2xl font-bold text-white">投稿管理</h1><p className="text-white/50">审核用户投稿</p></div>
      <div className="flex gap-4 mb-6">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
          <option value="">全部状态</option><option value="pending">待审核</option><option value="approved">已通过</option><option value="rejected">已拒绝</option>
        </select>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center py-12 text-white/40">加载中...</p>
        ) : (
          <>
            {filtered.map((submission: any) => (
              <div key={submission.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white">{submission.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusMap[submission.status]?.color}`}>{statusMap[submission.status]?.label}</span>
                    </div>
                    <p className="text-sm text-white/50 mb-2">{submission.description}</p>
                    <div className="text-xs text-white/40">
                      投稿人: {(submission.profiles as { nickname: string } | null)?.nickname ?? '匿名'} · {new Date(submission.created_at ?? '').toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {submission.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(submission.id)} className="px-3 py-1.5 text-xs bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/30">通过</button>
                        <button onClick={() => handleReject(submission.id)} className="px-3 py-1.5 text-xs bg-red-600/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-600/30">拒绝</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(submission.id)} className="px-3 py-1.5 text-xs bg-red-600/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-600/20">删除</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center py-12 text-white/40">暂无投稿</p>}
          </>
        )}
      </div>
    </div>
  )
}
