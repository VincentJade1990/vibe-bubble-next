'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 点赞/取消点赞
 */
export async function toggleLike(inspirationId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '请先登录', liked: false, count: 0 }
  }

  // 检查是否已点赞
  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('inspiration_id', inspirationId)
    .single()

  if (existing) {
    // 取消点赞
    await supabase.from('likes').delete().eq('id', existing.id)
    revalidatePath(`/inspiration/${inspirationId}`)
    return { success: true, error: null as string | null, liked: false, count: 0 }
  }

  // 添加点赞
  await supabase.from('likes').insert({
    user_id: user.id,
    inspiration_id: inspirationId,
  })

  revalidatePath(`/inspiration/${inspirationId}`)
  return { success: true, error: null as string | null, liked: true, count: 1 }
}

/**
 * 收藏/取消收藏
 */
export async function toggleFavorite(inspirationId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '请先登录', favorited: false, count: 0 }
  }

  // 检查是否已收藏
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('inspiration_id', inspirationId)
    .single()

  if (existing) {
    // 取消收藏
    await supabase.from('favorites').delete().eq('id', existing.id)
    revalidatePath(`/inspiration/${inspirationId}`)
    return { success: true, error: null as string | null, favorited: false, count: 0 }
  }

  // 添加收藏
  await supabase.from('favorites').insert({
    user_id: user.id,
    inspiration_id: inspirationId,
  })

  revalidatePath(`/inspiration/${inspirationId}`)
  return { success: true, error: null as string | null, favorited: true, count: 1 }
}

/**
 * 添加评论
 */
export async function addComment(inspirationId: string, formData: FormData) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '请先登录' }
  }

  const content = formData.get('content') as string
  if (!content?.trim()) {
    return { success: false, error: '评论内容不能为空' }
  }

  const { error } = await supabase.from('comments').insert({
    user_id: user.id,
    inspiration_id: inspirationId,
    content: content.trim(),
    status: 'pending',
  })

  if (error) {
    return { success: false, error: `发布失败: ${error.message}` }
  }

  revalidatePath(`/inspiration/${inspirationId}`)
  return { success: true, error: null as string | null }
}

/**
 * 获取当前用户对某灵感的互动状态
 */
export async function getUserInteractions(inspirationId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { liked: false, favorited: false }
  }

  const [{ data: like }, { data: favorite }] = await Promise.all([
    supabase.from('likes').select('*').eq('user_id', user.id).eq('inspiration_id', inspirationId).single(),
    supabase.from('favorites').select('*').eq('user_id', user.id).eq('inspiration_id', inspirationId).single(),
  ])

  return { liked: !!like, favorited: !!favorite }
}
