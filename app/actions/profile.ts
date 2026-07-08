'use server'

import { createClient } from '@/lib/supabase/server'
import { mockProfile } from '@/lib/mock-data'

/**
 * 获取当前用户的个人资料
 * 当 Supabase 不可用时自动回退到 mock 数据
 */
export async function getProfile() {
  try {
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
  } catch (err) {
    console.warn('getProfile: Supabase unavailable, using mock data', err)
    return { profile: mockProfile, error: null }
  }
}

/**
 * 更新个人资料
 * 当 Supabase 不可用时返回错误提示
 */
export async function updateProfile(formData: FormData) {
  try {
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
  } catch (err) {
    console.warn('updateProfile: Supabase unavailable', err)
    return { success: false, error: '更新失败: Supabase 连接异常' }
  }
}

/**
 * 获取当前用户的收藏列表
 * 当 Supabase 不可用时返回空数组
 */
export async function getMyFavorites() {
  try {
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
  } catch (err) {
    console.warn('getMyFavorites: Supabase unavailable', err)
    return { data: [], error: null }
  }
}

/**
 * 获取当前用户的点赞列表
 * 当 Supabase 不可用时返回空数组
 */
export async function getMyLikes() {
  try {
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
  } catch (err) {
    console.warn('getMyLikes: Supabase unavailable', err)
    return { data: [], error: null }
  }
}

/**
 * 获取当前用户的评论列表
 * 当 Supabase 不可用时返回空数组
 */
export async function getMyComments() {
  try {
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
  } catch (err) {
    console.warn('getMyComments: Supabase unavailable', err)
    return { data: [], error: null }
  }
}
