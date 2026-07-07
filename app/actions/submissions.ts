'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 用户提交投稿
 */
export async function createSubmission(formData: FormData) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const submission = {
    user_id: user?.id || null,
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    source_url: formData.get('source_url') as string || null,
    source_platform: formData.get('source_platform') as string || null,
    author_name: formData.get('author_name') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    project_type: formData.get('project_type') as string || null,
    tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : null,
    status: 'pending',
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single()

  if (error) {
    return { success: false, error: `投稿失败: ${error.message}` }
  }

  return { success: true, error: null as string | null, data }
}

/**
 * 获取投稿列表（后台管理用）
 */
export async function getSubmissions(options?: {
  status?: string
  page?: number
  limit?: number
}) {
  const supabase = createClient()
  const { status, page = 1, limit = 20 } = options || {}

  let query = supabase
    .from('submissions')
    .select(`
      *,
      profiles(nickname)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`获取投稿失败: ${error.message}`)
  }

  return { data: data as any[], count: count || 0 }
}

/**
 * 通过投稿（转为灵感）
 */
export async function approveSubmission(id: string) {
  const supabase = createClient()

  const { data: submission, error: fetchError } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !submission) {
    return { success: false, error: '投稿不存在' }
  }

  const slug = (submission.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) + '-' + Date.now().toString(36).slice(-4)

  const { data: inspiration, error: insertError } = await supabase
    .from('inspirations')
    .insert({
      title: submission.title,
      summary: submission.description?.slice(0, 200) || '',
      description: submission.description || '',
      source_url: submission.source_url,
      source_platform: submission.source_platform,
      author_name: submission.author_name,
      cover_image_url: submission.cover_image_url,
      project_type: submission.project_type,
      tags: submission.tags,
      slug,
      status: 'published',
    })
    .select()
    .single()

  if (insertError) {
    return { success: false, error: `发布失败: ${insertError.message}` }
  }

  await supabase
    .from('submissions')
    .update({ status: 'approved', converted_inspiration_id: inspiration.id })
    .eq('id', id)

  revalidatePath('/admin/submissions')
  revalidatePath('/gallery')
  return { success: true, error: null as string | null, data: inspiration }
}

/**
 * 拒绝投稿
 */
export async function rejectSubmission(id: string, adminNote?: string) {
  const supabase = createClient()

  const update: any = { status: 'rejected' }
  if (adminNote) {
    update.admin_note = adminNote
  }

  const { error } = await supabase
    .from('submissions')
    .update(update)
    .eq('id', id)

  if (error) {
    return { success: false, error: `操作失败: ${error.message}` }
  }

  revalidatePath('/admin/submissions')
  return { success: true, error: null as string | null }
}

/**
 * 删除投稿
 */
export async function deleteSubmission(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: `删除失败: ${error.message}` }
  }

  revalidatePath('/admin/submissions')
  return { success: true, error: null as string | null }
}

/**
 * 获取当前用户的投稿记录
 */
export async function getMySubmissions() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [], error: '请先登录' }
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: `获取失败: ${error.message}` }
  }

  return { data: data || [], error: null }
}
