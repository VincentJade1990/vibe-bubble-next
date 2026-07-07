import { getInspirations } from '@/app/actions/inspirations'
import Link from 'next/link'

/**
 * 前台灵感列表页
 */
export default async function GalleryPage() {
  const { data: inspirations } = await getInspirations()

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#050a14]/60 border-b border-white/5">
        <Link href="/" className="text-lg font-semibold">Vibe Bubble</Link>
        <div className="flex gap-4 text-sm text-slate-400">
          <Link href="/random" className="hover:text-white transition">随机灵感</Link>
          <Link href="/submit" className="hover:text-white transition">投稿</Link>
          <Link href="/profile" className="hover:text-white transition">个人中心</Link>
          <Link href="/admin" className="hover:text-white transition">后台</Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">灵感库</h1>
          <p className="text-white/50">发现 AI 驱动的创意灵感</p>
        </div>

        {inspirations.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p>暂无灵感数据</p>
            <p className="text-sm mt-2">去后台添加一些灵感吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirations.map((item) => (
              <Link
                key={item.id}
                href={`/inspiration/${item.slug}`}
                className="block group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all"
              >
                {item.cover_image_url && (
                  <div className="aspect-video overflow-hidden bg-slate-800">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-300">
                      {item.project_type}
                    </span>
                    <span className="text-xs text-slate-500">{item.source_platform}</span>
                  </div>
                  <h2 className="font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-400 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span>👁 {item.view_count || 0}</span>
                    <span>❤️ {item.like_count || 0}</span>
                    <span>⭐ {item.favorite_count || 0}</span>
                    {item.author_name && <span>@{item.author_name}</span>}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
