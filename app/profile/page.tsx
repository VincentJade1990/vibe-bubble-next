'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProfile, updateProfile, getMyFavorites, getMyComments } from '@/app/actions/profile'
import { getMySubmissions } from '@/app/actions/submissions'
import { signOut } from '@/app/actions/auth'

/**
 * 用户个人中心页面
 * 展示和编辑个人资料、查看收藏、评论和投稿
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [{ profile }, { data: favs }, { data: coms }, { data: subs }] = await Promise.all([
      getProfile(),
      getMyFavorites(),
      getMyComments(),
      getMySubmissions(),
    ])
    setProfile(profile)
    setFavorites(favs || [])
    setComments(coms || [])
    setSubmissions(subs || [])
    setLoading(false)
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    if (result.error) {
      setError(result.error)
      return
    }
    setEditing(false)
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center text-white/40">
        加载中...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">请先登录</p>
          <Link href="/login" className="px-4 py-2 bg-purple-600 text-white rounded-xl">
            去登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#050a14]/60 border-b border-white/5">
        <Link href="/" className="text-lg font-semibold">Vibe Bubble</Link>
        <div className="flex gap-4 text-sm text-slate-400">
          <Link href="/gallery" className="hover:text-white transition">灵感库</Link>
          <Link href="/submit" className="hover:text-white transition">投稿</Link>
          <Link href="/about" className="hover:text-white transition">项目介绍</Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 个人信息卡片 */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                  {profile.nickname?.[0] || '?'}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{profile.nickname || '未设置昵称'}</h1>
                  <p className="text-slate-400 text-sm mt-1">{profile.bio || '暂无简介'}</p>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 text-sm hover:text-purple-300 mt-1 inline-block"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition"
                >
                  {editing ? '取消' : '编辑资料'}
                </button>
                <form onSubmit={(e) => { e.preventDefault(); signOut(); }}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600/10 border border-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-600/20 transition"
                  >
                    退出登录
                  </button>
                </form>
              </div>
            </div>

            {/* 编辑表单 */}
            {editing && (
              <form onSubmit={handleUpdate} className="mt-6 pt-6 border-t border-white/10 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-white/60 mb-1">昵称</label>
                  <input
                    name="nickname"
                    defaultValue={profile.nickname || ''}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">简介</label>
                  <textarea
                    name="bio"
                    defaultValue={profile.bio || ''}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">个人网站</label>
                  <input
                    name="website"
                    type="url"
                    defaultValue={profile.website || ''}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
                  >
                    保存
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-sm text-white/50">我的收藏</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-2xl font-bold">{comments.length}</p>
              <p className="text-sm text-white/50">我的评论</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-2xl font-bold">{submissions.length}</p>
              <p className="text-sm text-white/50">我的投稿</p>
            </div>
          </div>

          {/* 收藏列表 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">我的收藏</h2>
            {favorites.length === 0 ? (
              <p className="text-white/30 text-sm">暂无收藏</p>
            ) : (
              <div className="space-y-3">
                {favorites.map((item) => (
                  <Link
                    key={item.id}
                    href={`/inspiration/${item.inspirations?.slug}`}
                    className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition"
                  >
                    <h3 className="font-medium text-white">{item.inspirations?.title}</h3>
                    <p className="text-sm text-white/40 mt-1">
                      {new Date(item.created_at!).toLocaleDateString('zh-CN')}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 投稿列表 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">我的投稿</h2>
            {submissions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/30 text-sm mb-3">暂无投稿</p>
                <Link
                  href="/submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-xl transition-colors"
                >
                  去投稿
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((item) => (
                  <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        item.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : item.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.status === 'approved' ? '已通过' : item.status === 'rejected' ? '已拒绝' : '待审核'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                      <span>{new Date(item.created_at!).toLocaleDateString('zh-CN')}</span>
                      {item.admin_note && (
                        <span className="text-red-400">备注: {item.admin_note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 评论列表 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">我的评论</h2>
            {comments.length === 0 ? (
              <p className="text-white/30 text-sm">暂无评论</p>
            ) : (
              <div className="space-y-3">
                {comments.map((item) => (
                  <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-slate-300 text-sm">{item.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                      <Link
                        href={`/inspiration/${item.inspirations?.slug}`}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {item.inspirations?.title}
                      </Link>
                      <span>{new Date(item.created_at!).toLocaleDateString('zh-CN')}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        item.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : item.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.status === 'approved' ? '已通过' : item.status === 'rejected' ? '已拒绝' : '待审核'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
