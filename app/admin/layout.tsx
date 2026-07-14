import { getProfile } from '@/app/actions/profile'
import Link from 'next/link'

/**
 * 后台管理布局
 * 未登录时渲染提示页面，避免重定向循环
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let profile: { nickname?: string; role?: string } | null = null
  try {
    const result = await getProfile()
    profile = result.profile
  } catch {
    // Supabase不可用时静默处理
  }

  const isAdmin = profile && profile.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050a14] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-2">Vibe Bubble</h1>
          <p className="text-white/50 mb-8">后台管理系统</p>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <p className="text-white/60 mb-6">请先登录管理员账号以访问后台。</p>
            <Link
              href="/login"
              className="inline-block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all text-center"
            >
              前往登录
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', label: '概览', icon: '📊' },
    { href: '/admin/candidates', label: '候选池', icon: '📝' },
    { href: '/admin/inspirations', label: '灵感库', icon: '💡' },
    { href: '/admin/submissions', label: '投稿管理', icon: '📮' },
    { href: '/admin/comments', label: '评论管理', icon: '💬' },
  ]

  return (
    <div className="min-h-screen bg-[#050a14] text-white flex">
      <aside className="w-64 bg-white/5 border-r border-white/10 flex-shrink-0 flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-white">Vibe Bubble</Link>
          <p className="text-white/40 text-sm mt-1">后台管理</p>
        </div>
        <nav className="px-4 py-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-medium">
              {profile?.nickname?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{profile?.nickname ?? '管理员'}</p>
              <p className="text-xs text-white/40">管理员</p>
            </div>
          </div>
          <Link href="/profile" className="block mt-2 px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all text-center">
            退出
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-8">{children}</div></main>
    </div>
  )
}
