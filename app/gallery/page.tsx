import { getInspirations } from '@/app/actions/inspirations'
import GalleryView from '@/app/components/bubble/GalleryView'

/**
 * 灵感库页面（服务端组件）
 * 数据获取后交给客户端组件处理视图切换
 */
export default async function GalleryPage() {
  const { data: inspirations } = await getInspirations()

  return <GalleryView inspirations={inspirations} />
}
