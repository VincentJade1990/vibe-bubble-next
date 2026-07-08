'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@/lib/supabase/admin'

/**
 * 用户注册
 * 当 Supabase 不可用时返回错误提示
 */
export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nickname = formData.get('nickname') as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname || email.split('@')[0],
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // 创建用户资料
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nickname: nickname || email.split('@')[0],
      })
    }

    return { success: true, error: null as string | null, user: data.user }
  } catch (err) {
    console.warn('signUp: Supabase unavailable', err)
    return { success: false, error: '注册失败: Supabase 连接异常' }
  }
}

/**
 * 用户登录
 * 当 Supabase 不可用时返回错误提示
 */
export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null as string | null, user: data.user }
  } catch (err) {
    console.warn('signIn: Supabase unavailable', err)
    return { success: false, error: '登录失败: Supabase 连接异常' }
  }
}

/**
 * 管理员登录
 * 当 Supabase 不可用时返回错误提示
 */
export async function adminLogin(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { success: false, error: error?.message || '登录失败' }
    }

    // 检查是否为管理员
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: '无权访问' }
    }

    return { success: true, error: null as string | null, user: data.user }
  } catch (err) {
    console.warn('adminLogin: Supabase unavailable', err)
    return { success: false, error: '登录失败: Supabase 连接异常' }
  }
}

/**
 * 退出登录
 * 当 Supabase 不可用时静默处理
 */
export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('signOut: Supabase unavailable', err)
  }
}
