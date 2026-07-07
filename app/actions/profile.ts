'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * 获取当前用户的个人资料
 */
export async function getProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { profile: null, error: '未登录' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return { profile: null, error: error.message }
  }

  return { profile: data, error: null }
}

/**
 * 更新个人资料
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '请先登录' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: formData.get('nickname') as string,
      bio: formData.get('bio') as string || null,
      website: formData.get('website') as string || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null as string | null }
}

/**
 * 获取当前用户的收藏列表
 */
export async function getMyFavorites() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [], error: '请先登录' }
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('*, inspirations(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

/**
 * 获取当前用户的点赞列表
 */
export async function getMyLikes() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [], error: '请先登录' }
  }

  const { data, error } = await supabase
    .from('likes')
    .select('*, inspirations(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

/**
 * 获取当前用户的评论列表
 */
export async function getMyComments() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [], error: '请先登录' }
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*, inspirations(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}
