import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 获取环境变量，兼容多种运行环境
 * Cloudflare Workers 中环境变量可能通过不同方式注入
 */
function getEnvVar(name: string): string | undefined {
  // 标准 Node.js process.env
  if (typeof process !== 'undefined' && process.env?.[name]) {
    return process.env[name]
  }
  // Cloudflare Workers 可能通过 globalThis 注入
  try {
    const globalVal = (globalThis as Record<string, unknown>)[name]
    if (typeof globalVal === 'string') return globalVal
  } catch { /* ignore */ }
  return undefined
}

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase environment variables: ` +
      `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl ? 'set' : 'missing'}, ` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey ? 'set' : 'missing'}`
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {}
        },
      },
    }
  )
}