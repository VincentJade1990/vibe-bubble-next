'use client'

import { useState, useEffect } from 'react'
import { toggleLike, toggleFavorite, addComment, getUserInteractions } from '@/app/actions/interactions'

/**
 * 互动栏组件
 */
export function InteractionBar({
  inspirationId,
  likeCount,
  favoriteCount,
  commentCount,
}: {
  inspirationId: string
  likeCount: number
  favoriteCount: number
  commentCount: number
}) {
  const [likes, setLikes] = useState(likeCount)
  const [favorites, setFavorites] = useState(favoriteCount)
  const [comments, setComments] = useState(commentCount)
  const [liked, setLiked] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadInteractions() {
      const { liked: userLiked, favorited: userFavorited } = await getUserInteractions(inspirationId)
      setLiked(userLiked)
      setFavorited(userFavorited)
      setIsLoading(false)
    }
    loadInteractions()
  }, [inspirationId])

  async function handleLike() {
    const result = await toggleLike(inspirationId)
    if (result.success) {
      setLiked(result.liked)
      setLikes(prev => result.liked ? prev + 1 : prev - 1)
    } else if (result.error) {
      alert(result.error)
    }
  }

  async function handleFavorite() {
    const result = await toggleFavorite(inspirationId)
    if (result.success) {
      setFavorited(result.favorited)
      setFavorites(prev => result.favorited ? prev + 1 : prev - 1)
    } else if (result.error) {
      alert(result.error)
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return

    const formData = new FormData()
    formData.set('content', commentText)

    const result = await addComment(inspirationId, formData)
    if (result.success) {
      setCommentText('')
      setShowCommentForm(false)
      setComments(c => c + 1)
    } else if (result.error) {
      alert(result.error)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${liked ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'}`}
        >
          <span>{liked ? '❤️' : '🤍'}</span><span>{likes}</span>
        </button>
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${favorited ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'}`}
        >
          <span>{favorited ? '⭐' : '☆'}</span><span>{favorites}</span>
        </button>
        <button onClick={() => setShowCommentForm(!showCommentForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 hover:text-white transition-all">
          <span>💬</span><span>{comments}</span>
        </button>
      </div>
      {showCommentForm && (
        <form onSubmit={handleComment} className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="写下你的评论..." required rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none" />
          <div className="flex justify-end gap-3 mt-3">
            <button type="button" onClick={() => setShowCommentForm(false)} className="px-4 py-2 text-slate-400 hover:text-white transition">取消</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">发表评论</button>
          </div>
        </form>
      )}
    </div>
  )
}
