'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * 前台用户注册页面
 */
export default function RegisterPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const nickname = formData.get('nickname') as string

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密码至少需要 6 位')
      setLoading(false)
      return
    }

    const supabase = createClient()

    // 注册账号
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname || email.split('@')[0],
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // 创建用户资料
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nickname: nickname || email.split('@')[0],
      })
    }

    // 注册成功，跳转到登录页
    router.push('/login?registered=true')
  }

  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white">Vibe Bubble</Link>
          <p className="text-white/50 mt-2">创建新账号</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-white/70 mb-2">
                昵称
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="你的昵称"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                邮箱 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                密码 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="至少 6 位"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
                确认密码 *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="再次输入密码"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            已有账号？
            <Link href="/login" className="text-purple-400 hover:text-purple-300 ml-1">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
