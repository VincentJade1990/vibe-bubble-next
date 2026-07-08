import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 获取环境变量，兼容多种运行环境
 */
function getEnvVar(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env?.[name]) {
    return process.env[name]
  }
  try {
    const globalVal = (globalThis as Record<string, unknown>)[name]
    if (typeof globalVal === 'string') return globalVal
  } catch { /* ignore */ }
  return undefined
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  // 如果环境变量缺失，跳过 Supabase 初始化，避免 500 错误
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Middleware: Supabase env vars missing, skipping auth')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 刷新 session token
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}