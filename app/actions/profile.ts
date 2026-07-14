'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * 获取当前用户资料 - 使用 @supabase/supabase-js 替代 @supabase/ssr
 */
export async function getProfile() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')?.value

    if (!token) {
      return { profile: null }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { profile: null }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single()

    return { profile: profile || null }
  } catch {
    return { profile: null }
  }
}
