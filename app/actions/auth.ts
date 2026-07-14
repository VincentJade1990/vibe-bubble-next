'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * 用户注册
 */
export async function signUp(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nickname = formData.get('nickname') as string

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname: nickname || email.split('@')[0] } },
    })

    if (error) return { success: false, error: error.message }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nickname: nickname || email.split('@')[0],
      })
    }

    return { success: true, error: null as string | null, user: data.user }
  } catch (err) {
    return { success: false, error: '注册失败: Supabase 连接异常' }
  }
}

/**
 * 用户登录
 */
export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { success: false, error: error.message }

    return { success: true, error: null as string | null, user: data.user }
  } catch (err) {
    return { success: false, error: '登录失败: Supabase 连接异常' }
  }
}

/**
 * 管理员登录 - 使用 @supabase/supabase-js 替代 @supabase/ssr
 */
export async function adminLogin(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // 调试：检查环境变量
    if (!url || !key) {
      return {
        success: false,
        error: `配置缺失: url=${url ? '有' : '无'}, key=${key ? '有(' + key.substring(0, 5) + '...)' : '无'}`,
      }
    }

    const supabase = createClient(url, key)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || `登录失败(状态:${(error as any)?.status || 'unknown'})`,
      }
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

    // 手动设置 cookie
    const cookieStore = await cookies()
    cookieStore.set('sb-access-token', data.session!.access_token, {
      httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7, path: '/',
    })

    return { success: true, error: null as string | null, user: data.user }
  } catch (err) {
    return { success: false, error: '登录失败: ' + (err instanceof Error ? err.message : '未知错误') }
  }
}

/**
 * 退出登录
 */
export async function signOut() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('sb-access-token')
  } catch {}
}
