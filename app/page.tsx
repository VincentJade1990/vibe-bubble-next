import { redirect } from 'next/navigation'

/**
 * 首页 - 重定向到管理后台
 */
export default function Home() {
  redirect('/admin')
}
