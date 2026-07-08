'use server'

import { createClient } from '@/lib/supabase/server'
import { mockInspirations } from '@/lib/mock-data'
import { revalidatePath } from 'next/cache'

/**
 * 获取灵感列表（前台展示用）
 * 当 Supabase 不可用时自动回退到 mock 数据
 */
export async function getInspirations(options?: {
  status?: string
  page?: number
  limit?: number
  tag?: string
  projectType?: string
}) {
  try {
    const supabase = await createClient()
    const { status = 'published', page = 1, limit = 20, tag, projectType } = options || {}

    let query = supabase
      .from('inspirations')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (tag) {
      query = query.contains('tags', [tag])
    }
    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      throw new Error(`获取灵感失败: ${error.message}`)
    }

    return { data: data || [], count: count || 0 }
  } catch (err) {
    console.warn('getInspirations: Supabase unavailable, using mock data', err)
    return { data: mockInspirations, count: mockInspirations.length }
  }
}

/**
 * 获取灵感详情
 */
export async function getInspirationBySlug(slug: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('inspirations')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      return { data: null, error: `获取灵感失败: ${error.message}` }
    }

    return { data, error: null }
  } catch (err) {
    console.warn('getInspirationBySlug: Supabase unavailable, using mock data', err)
    const mock = mockInspirations.find(i => i.slug === slug)
    return { data: mock || null, error: mock ? null : '未找到该灵感' }
  }
}

/**
 * 获取所有灵感（后台管理用）
 */
export async function getAllInspirations(options?: {
  status?: string
  page?: number
  limit?: number
}) {
  try {
    const supabase = await createClient()
    const { status, page = 1, limit = 20 } = options || {}

    let query = supabase
      .from('inspirations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      throw new Error(`获取灵感失败: ${error.message}`)
    }

    return { data: data || [], count: count || 0 }
  } catch (err) {
    console.warn('getAllInspirations: Supabase unavailable, using mock data', err)
    return { data: mockInspirations, count: mockInspirations.length }
  }
}

/**
 * 创建灵感
 */
export async function createInspiration(formData: FormData) {
  try {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const slug = title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36).slice(-4)

    const { data, error } = await supabase
      .from('inspirations')
      .insert({
        title,
        summary: formData.get('description') as string,
        description: formData.get('content') as string || formData.get('description') as string,
        source_url: formData.get('source_url') as string || null,
        source_platform: formData.get('source_platform') as string || null,
        author_name: formData.get('author_name') as string || null,
        cover_image_url: formData.get('cover_image_url') as string || null,
        project_type: formData.get('project_type') as string || null,
        tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : null,
        slug,
        status: (formData.get('status') as string) || 'draft',
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: `创建失败: ${error.message}` }
    }

    revalidatePath('/admin/inspirations')
    revalidatePath('/gallery')
    return { success: true, error: null as string | null, data }
  } catch (err) {
    return { success: false, error: `创建失败: Supabase 连接异常` }
  }
}

/**
 * 更新灵感
 */
export async function updateInspiration(id: string, formData: FormData) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('inspirations')
      .update({
        title: formData.get('title') as string,
        summary: formData.get('description') as string,
        description: formData.get('content') as string,
        source_url: formData.get('source_url') as string || null,
        source_platform: formData.get('source_platform') as string || null,
        author_name: formData.get('author_name') as string || null,
        cover_image_url: formData.get('cover_image_url') as string || null,
        tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : null,
        project_type: formData.get('project_type') as string || null,
        status: formData.get('status') as string,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: `更新失败: ${error.message}` }
    }

    revalidatePath('/admin/inspirations')
    revalidatePath('/gallery')
    return { success: true, error: null as string | null }
  } catch (err) {
    return { success: false, error: `更新失败: Supabase 连接异常` }
  }
}

/**
 * 删除灵感
 */
export async function deleteInspiration(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('inspirations')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: `删除失败: ${error.message}` }
    }

    revalidatePath('/admin/inspirations')
    revalidatePath('/gallery')
    return { success: true, error: null as string | null }
  } catch (err) {
    return { success: false, error: `删除失败: Supabase 连接异常` }
  }
}

/**
 * 发布灵感
 */
export async function publishInspiration(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('inspirations')
      .update({ status: 'published', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return { success: false, error: `发布失败: ${error.message}` }
    }

    revalidatePath('/admin/inspirations')
    revalidatePath('/gallery')
    return { success: true, error: null as string | null }
  } catch (err) {
    return { success: false, error: `发布失败: Supabase 连接异常` }
  }
}