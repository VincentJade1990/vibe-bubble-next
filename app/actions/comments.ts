'use server'

import { createClient } from '@/lib/supabase/server'
import { mockComments } from '@/lib/mock-data'
import { revalidatePath } from 'next/cache'

/**
 * 获取前台评论列表（已审核）
 * 当 Supabase 不可用时自动回退到 mock 数据
 */
export async function getComments(inspirationId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(nickname)
      `)
      .eq('inspiration_id', inspirationId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.warn('getComments: Supabase unavailable, using mock data', err)
    return { data: mockComments.filter(c => c.status === 'approved'), error: null }
  }
}

/**
 * 获取评论列表（后台管理用）
 * 当 Supabase 不可用时自动回退到 mock 数据
 */
export async function getAdminComments(options?: { status?: string; page?: number; limit?: number }) {
  try {
    const supabase = await createClient()
    const { status, page = 1, limit = 20 } = options || {}

    let query = supabase
      .from('comments')
      .select(`
        *,
        profiles(nickname),
        inspirations(title, slug)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      throw new Error(`获取评论失败: ${error.message}`)
    }

    return { data: data as any[], count: count || 0 }
  } catch (err) {
    console.warn('getAdminComments: Supabase unavailable, using mock data', err)
    return { data: mockComments, count: mockComments.length }
  }
}

/**
 * 审核通过评论
 */
export async function approveComment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) {
    return { success: false, error: `操作失败: ${error.message}` }
  }

  revalidatePath('/admin/comments')
  return { success: true, error: null as string | null }
}

/**
 * 拒绝评论
 */
export async function rejectComment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) {
    return { success: false, error: `操作失败: ${error.message}` }
  }

  revalidatePath('/admin/comments')
  return { success: true, error: null as string | null }
}

/**
 * 删除评论
 */
export async function deleteComment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: `删除失败: ${error.message}` }
  }

  revalidatePath('/admin/comments')
  return { success: true, error: null as string | null }
}

/**
 * 获取当前用户的评论列表
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
    console.warn('getMyComments: Supabase unavailable, using mock data', err)
    return { data: [], error: null }
  }
}
