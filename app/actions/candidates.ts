'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 获取候选列表（后台管理用）
 */
export async function getCandidates(options?: {
  status?: string
  page?: number
  limit?: number
}) {
  const supabase = await createClient()
  const { status, page = 1, limit = 20 } = options || {}

  let query = supabase
    .from('candidates')
    .select(`
      *,
      profiles(nickname)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('review_status', status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    throw new Error(`获取候选失败: ${error.message}`)
  }

  return { data: data || [], count: count || 0 }
}

/**
 * 通过候选（转为灵感）
 */
export async function approveCandidate(id: string) {
  const supabase = await createClient()

  const { data: candidate, error: fetchError } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !candidate) {
    return { success: false, error: '候选不存在' }
  }

  const slug = (candidate.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) + '-' + Date.now().toString(36).slice(-4)

  const { data: inspiration, error: insertError } = await supabase
    .from('inspirations')
    .insert({
      title: candidate.title,
      summary: candidate.raw_text?.slice(0, 200) || '',
      description: candidate.raw_text || '',
      source_url: candidate.source_url,
      source_platform: candidate.source_platform,
      author_name: candidate.author_name,
      slug,
      status: 'published',
    })
    .select()
    .single()

  if (insertError) {
    return { success: false, error: `发布失败: ${insertError.message}` }
  }

  await supabase
    .from('candidates')
    .update({ review_status: 'approved', converted_inspiration_id: inspiration.id })
    .eq('id', id)

  revalidatePath('/admin/candidates')
  revalidatePath('/gallery')
  return { success: true, error: null as string | null }
}

/**
 * 拒绝候选
 */
export async function rejectCandidate(id: string, reason?: string) {
  const supabase = await createClient()

  const update: any = { review_status: 'rejected' }
  if (reason) {
    update.admin_note = reason
  }

  const { error } = await supabase
    .from('candidates')
    .update(update)
    .eq('id', id)

  if (error) {
    return { success: false, error: `操作失败: ${error.message}` }
  }

  revalidatePath('/admin/candidates')
  return { success: true, error: null as string | null }
}

/**
 * 删除候选
 */
export async function deleteCandidate(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: `删除失败: ${error.message}` }
  }

  revalidatePath('/admin/candidates')
  return { success: true, error: null as string | null }
}

/**
 * 批量获取候选（用于列表分页）
 */
export async function getAllCandidates() {
  return getCandidates()
}
