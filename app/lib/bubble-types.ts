/**
 * 气泡聚合组件类型定义
 * 将 Supabase inspirations 表数据映射为气泡组件所需的 CaseItem 格式
 */

/** 支持的社媒平台枚举 */
export type Platform = 'xiaohongshu' | 'bilibili' | 'douyin' | 'juejin' | 'x' | 'twitter' | 'producthunt' | 'github' | 'hackernews' | 'reddit' | string;

/** 难度等级枚举 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/** 浏览模式枚举 */
export type ViewMode = 'card' | 'canvas';

/**
 * 案例数据主接口（与第一阶段保持一致，供气泡组件使用）
 */
export interface CaseItem {
  id: string;
  title: string;
  platform: Platform;
  originalUrl: string;
  coverImage: string;
  prompt: string;
  likes: number;
  heatScore: number;
  sceneTags: string[];
  difficulty: Difficulty;
  author?: string;
  publishTime: string;
  description?: string;
  slug: string;
}

export const PLATFORM_NAMES: Record<string, string> = {
  xiaohongshu: '小红书',
  bilibili: 'B站',
  douyin: '抖音',
  juejin: '掘金',
  x: 'X',
  twitter: 'Twitter',
  producthunt: 'ProductHunt',
  github: 'GitHub',
  hackernews: 'HackerNews',
  reddit: 'Reddit',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

export function mapInspirationToCaseItem(item: any): CaseItem {
  const views = item.view_count || 0;
  const likes = item.like_count || 0;
  const favs = item.favorite_count || 0;
  const rawScore = views + likes * 2 + favs * 3;
  const heatScore = Math.min(100, Math.round(Math.log10(rawScore + 1) * 25));

  return {
    id: item.id,
    title: item.title,
    platform: (item.source_platform || 'unknown').toLowerCase() as Platform,
    originalUrl: item.source_url || '#',
    coverImage: item.cover_image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop',
    prompt: item.description || item.summary || '',
    likes: likes,
    heatScore: heatScore,
    sceneTags: item.tags || [],
    difficulty: (item.difficulty || 'beginner') as Difficulty,
    author: item.author_name || undefined,
    publishTime: item.created_at || new Date().toISOString(),
    description: item.summary || item.description || '',
    slug: item.slug || item.id,
  };
}

export function mapInspirationsToCaseItems(items: any[]): CaseItem[] {
  return items.map(mapInspirationToCaseItem);
}
