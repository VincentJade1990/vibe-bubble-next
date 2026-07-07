'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createSubmission } from '@/app/actions/submissions'

/**
 * 用户投稿页面
 */
export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createSubmission(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-white mb-2">投稿成功！</h1>
          <p className="text-white/50 mb-6">感谢你的分享，我们会尽快审核</p>
          <div className="flex gap-4 justify-center">
            <Link href="/gallery" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">去浏览灵感</Link>
            <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-colors">继续投稿</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#050a14]/60 border-b border-white/5">
        <Link href="/" className="text-lg font-semibold">Vibe Bubble</Link>
        <div className="flex gap-4 text-sm text-slate-400">
          <Link href="/gallery" className="hover:text-white transition">灵感库</Link>
          <Link href="/profile" className="hover:text-white transition">个人中心</Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">投稿灵感</h1>
            <p className="text-white/50">分享你发现的优秀 AI 创作案例</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-white/70 mb-2">标题 <span className="text-red-400">*</span></label>
                <input name="title" required placeholder="如：用 AI 生成的复古风格海报" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">描述</label>
                <textarea name="description" rows={4} placeholder="简要描述这个案例的特点、用途..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">来源链接</label>
                  <input name="source_url" type="url" placeholder="https://..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">来源平台</label>
                  <input name="source_platform" placeholder="如：Twitter、Reddit" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">作者</label>
                  <input name="author_name" placeholder="原创作者名称" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">项目类型</label>
                  <select name="project_type" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50">
                    <option value="">选择类型</option>
                    <option value="website">网站</option>
                    <option value="app">应用</option>
                    <option value="game">游戏</option>
                    <option value="tool">工具</option>
                    <option value="art">艺术</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">封面图片链接</label>
                <input name="cover_image_url" type="url" placeholder="https://..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">标签</label>
                <input name="tags" placeholder="用逗号分隔，如：AI绘画, 海报设计, 复古" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50" />
              </div>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? '提交中...' : '提交投稿'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
