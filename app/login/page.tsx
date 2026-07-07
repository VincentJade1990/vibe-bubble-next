'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

/**
 * 前台用户登录页面
 */
export default function LoginPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/')
    }
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
          <p className="text-white/50 mt-2">登录你的账号</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">邮箱</label>
              <input id="email" name="email" type="email" required placeholder="your@email.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">密码</label>
              <input id="password" name="password" type="password" required placeholder="请输入密码" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all" />
            </div>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-white/40">
            还没有账号？
            <Link href="/register" className="text-purple-400 hover:text-purple-300 ml-1">立即注册</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
