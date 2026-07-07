'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@/lib/supabase/admin'

/**
 * 用户注册
 */
export async function signUp(formData: FormData) {
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
}

/**
 * 用户登录
 */
export async function signIn(formData: FormData) {
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
}

/**
 * 管理员登录
 */
export async function adminLogin(formData: FormData) {
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
}

/**
 * 退出登录
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
