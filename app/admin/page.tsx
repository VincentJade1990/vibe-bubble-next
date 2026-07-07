import { getCandidates } from '@/app/actions/candidates'
import { getAllInspirations } from '@/app/actions/inspirations'
import { getAdminComments } from '@/app/actions/comments'
import { getSubmissions } from '@/app/actions/submissions'
import Link from 'next/link'

/**
 * 后台 Dashboard 概览页
 */
export default async function AdminDashboardPage() {
  const [{ data: candidates, count: candidatesCount }, { data: inspirations, count: inspirationsCount }, { data: comments, count: commentsCount }, { data: submissions, count: submissionsCount }] = await Promise.all([
    getCandidates(),
    getAllInspirations(),
    getAdminComments(),
    getSubmissions(),
  ])

  const pendingCandidates = candidates.filter((c: { review_status: string }) => c.review_status === 'pending').length
  const publishedInspirations = inspirations.filter((i: { status: string }) => i.status === 'published').length
  const pendingSubmissions = submissions.filter((s: { status: string }) => s.status === 'pending').length

  const statCards = [
    { title: '候选总数', value: candidatesCount, subtitle: `待审核: ${pendingCandidates}`, href: '/admin/candidates', color: 'from-yellow-600/20 to-orange-600/20', borderColor: 'border-yellow-500/20' },
    { title: '灵感总数', value: inspirationsCount, subtitle: `已发布: ${publishedInspirations}`, href: '/admin/inspirations', color: 'from-purple-600/20 to-blue-600/20', borderColor: 'border-purple-500/20' },
    { title: '评论总数', value: commentsCount, subtitle: '用户互动', href: '/admin/comments', color: 'from-green-600/20 to-teal-600/20', borderColor: 'border-green-500/20' },
    { title: '投稿总数', value: submissionsCount, subtitle: `待审核: ${pendingSubmissions}`, href: '/admin/submissions', color: 'from-pink-600/20 to-rose-600/20', borderColor: 'border-pink-500/20' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">概览</h1>
      <p className="text-white/50 mb-8">Vibe Bubble 后台管理系统</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href} className={`block p-6 bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.borderColor} rounded-2xl hover:scale-[1.02] transition-transform`}>
            <h3 className="text-white/60 text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-white/40 text-sm">{card.subtitle}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">快速操作</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/candidates" className="px-6 py-3 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/30 transition-all">审核候选</Link>
          <Link href="/admin/inspirations" className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-600/30 transition-all">管理灵感</Link>
          <Link href="/admin/submissions" className="px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-600/30 transition-all">审核投稿</Link>
        </div>
      </div>
    </div>
  )
}
