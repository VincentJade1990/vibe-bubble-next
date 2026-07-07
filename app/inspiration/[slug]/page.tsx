import { getInspirationBySlug } from '@/app/actions/inspirations'
import { getComments } from '@/app/actions/comments'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InteractionBar } from './interaction-bar'

/**
 * 前台灵感详情页
 */
export default async function InspirationDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const { data: inspiration, error } = await getInspirationBySlug(params.slug)

  if (!inspiration || error) {
    notFound()
  }

  const { data: comments } = await getComments(inspiration.id)

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#050a14]/60 border-b border-white/5">
        <Link href="/" className="text-lg font-semibold">Vibe Bubble</Link>
        <div className="flex gap-4 text-sm text-slate-400">
          <Link href="/gallery" className="hover:text-white transition">灵感库</Link>
          <Link href="/random" className="hover:text-white transition">随机灵感</Link>
          <Link href="/submit" className="hover:text-white transition">投稿</Link>
          <Link href="/profile" className="hover:text-white transition">个人中心</Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6">
            <span>←</span><span>返回灵感库</span>
          </Link>

          <div className="mb-8">
            {inspiration.cover_image_url && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-800">
                <img src={inspiration.cover_image_url} alt={inspiration.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{inspiration.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              {inspiration.source_platform && <span>来源: {inspiration.source_platform}</span>}
              {inspiration.author_name && <span>作者: @{inspiration.author_name}</span>}
              {inspiration.project_type && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{inspiration.project_type}</span>
              )}
            </div>
          </div>

          <InteractionBar
            inspirationId={inspiration.id}
            likeCount={inspiration.like_count ?? 0}
            favoriteCount={inspiration.favorite_count ?? 0}
            commentCount={inspiration.comment_count ?? 0}
          />

          <div className="space-y-8">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h2 className="text-lg font-semibold mb-3">简介</h2>
              <p className="text-slate-300 leading-relaxed">{inspiration.summary}</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h2 className="text-lg font-semibold mb-3">详情</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{inspiration.description}</div>
            </div>

            {inspiration.tools && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h2 className="text-lg font-semibold mb-3">使用工具</h2>
                <div className="flex flex-wrap gap-2">
                  {inspiration.tools.map((tool: string) => (
                    <span key={tool} className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-sm">{tool}</span>
                  ))}
                </div>
              </div>
            )}

            {inspiration.tags && (
              <div className="flex flex-wrap gap-2">
                {inspiration.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-sm">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold mb-6">评论 ({comments.length})</h2>
            <div className="space-y-4 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-medium">
                      {(comment.profiles as { nickname: string } | null)?.nickname?.[0] ?? '?'}
                    </div>
                    <span className="text-sm font-medium">{(comment.profiles as { nickname: string } | null)?.nickname ?? '匿名用户'}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.created_at ?? '').toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
