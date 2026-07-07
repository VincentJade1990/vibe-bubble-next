export const mockInspirations = [
  {
    id: "1",
    title: "AI 生成的复古海报设计",
    summary: "使用 Midjourney 和 Photoshop 创作的复古风格海报，融合 80 年代霓虹美学与现代 AI 技术。",
    description: "这是一个展示 AI 辅助创作的案例。设计师使用 Midjourney 生成基础图像，然后在 Photoshop 中进行精修。整个过程从概念到成品只用了 2 小时。",
    slug: "ai-retro-poster-001",
    status: "published",
    source_platform: "Twitter",
    author_name: "design_ai",
    cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop",
    project_type: "art",
    tags: ["AI绘画", "海报设计", "复古"],
    tools: ["Midjourney", "Photoshop"],
    view_count: 128,
    like_count: 45,
    favorite_count: 23,
    comment_count: 8,
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Next.js 全栈 SaaS 模板",
    summary: "一套开箱即用的 SaaS 启动模板，包含认证、支付、管理后台。",
    description: "基于 Next.js 14 App Router + Prisma + Stripe 的全栈 SaaS 模板。内置用户认证、订阅管理、管理后台、邮件通知等功能。",
    slug: "nextjs-saas-template-002",
    status: "published",
    source_platform: "ProductHunt",
    author_name: "dev_starter",
    cover_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    project_type: "website",
    tags: ["Next.js", "SaaS", "开源"],
    tools: ["Next.js", "Prisma", "Stripe"],
    view_count: 256,
    like_count: 89,
    favorite_count: 67,
    comment_count: 12,
    created_at: "2026-07-02T08:00:00Z",
  },
  {
    id: "3",
    title: "AI 语音克隆工具",
    summary: "只需 10 秒音频即可克隆任何人的声音，支持多种语言。",
    description: "这个工具使用最新的语音合成技术，只需极短的音频样本就能生成高质量的语音克隆。支持实时语音转换和多语言输出。",
    slug: "ai-voice-clone-003",
    status: "published",
    source_platform: "Reddit",
    author_name: "voice_ai_lab",
    cover_image_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop",
    project_type: "tool",
    tags: ["AI语音", "音频", "工具"],
    tools: ["Python", "PyTorch", "FastAPI"],
    view_count: 512,
    like_count: 156,
    favorite_count: 98,
    comment_count: 25,
    created_at: "2026-07-03T06:00:00Z",
  },
  {
    id: "4",
    title: "3D AI 生成室内设计师",
    summary: "输入文字描述即可生成逼真的 3D 室内设计方案。",
    description: "结合 3D 渲染和生成式 AI，这个工具可以根据用户的文字描述生成完整的室内设计方案，包括家具布局、材质选择和光照效果。",
    slug: "3d-ai-interior-004",
    status: "published",
    source_platform: "HackerNews",
    author_name: "interior_ai",
    cover_image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
    project_type: "tool",
    tags: ["3D", "室内设计", "AI"],
    tools: ["Blender", "Stable Diffusion", "React"],
    view_count: 189,
    like_count: 67,
    favorite_count: 34,
    comment_count: 15,
    created_at: "2026-06-28T14:00:00Z",
  },
  {
    id: "5",
    title: "AI 代码审查助手",
    summary: "自动审查代码并提出优化建议，支持多种编程语言。",
    description: "这个工具可以自动分析代码质量，检测潜在 bug，并提出重构建议。支持 Python、JavaScript、TypeScript、Go 等主流语言。",
    slug: "ai-code-review-005",
    status: "published",
    source_platform: "GitHub",
    author_name: "code_wizard",
    cover_image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
    project_type: "tool",
    tags: ["代码", "AI", "开发工具"],
    tools: ["Python", "AST", "OpenAI API"],
    view_count: 334,
    like_count: 112,
    favorite_count: 78,
    comment_count: 20,
    created_at: "2026-06-25T09:00:00Z",
  },
];

export const mockCandidates = [
  { id: "c1", title: "AI 生成音乐平台", raw_text: "使用 AI 生成原创音乐的平台...", source_url: "https://example.com/music", source_platform: "Twitter", author_name: "music_ai", review_status: "pending", created_at: "2026-07-04T10:00:00Z" },
  { id: "c2", title: "智能简历生成器", raw_text: "根据职位描述自动生成优化简历...", source_url: "https://example.com/resume", source_platform: "ProductHunt", author_name: "resume_dev", review_status: "pending", created_at: "2026-07-04T08:00:00Z" },
  { id: "c3", title: "AI 辅助写作工具", raw_text: "帮助作者克服写作障碍的 AI 工具...", source_url: "https://example.com/writing", source_platform: "Reddit", author_name: "write_ai", review_status: "approved", created_at: "2026-07-03T12:00:00Z" },
];

export const mockComments = [
  { id: "cm1", content: "这个设计太棒了！配色非常和谐。", status: "approved", created_at: "2026-07-03T10:00:00Z", profiles: { nickname: "设计爱好者" }, inspirations: { title: "AI 生成的复古海报设计", slug: "ai-retro-poster-001" } },
  { id: "cm2", content: "代码结构可以优化一下。", status: "pending", created_at: "2026-07-04T08:00:00Z", profiles: { nickname: "开发者小明" }, inspirations: { title: "Next.js 全栈 SaaS 模板", slug: "nextjs-saas-template-002" } },
];

export const mockSubmissions = [
  { id: "s1", title: "AI 视频编辑工具", description: "一键生成短视频的 AI 工具", source_platform: "Twitter", status: "pending", created_at: "2026-07-04T10:00:00Z", profiles: { nickname: "投稿用户" } },
];

export const mockProfile: {
  id: string;
  nickname: string;
  bio: string | null;
  website: string | null;
  role: string;
} = {
  id: "user1",
  nickname: "测试用户",
  bio: "热爱 AI 创作",
  website: "https://example.com",
  role: "admin",
};

export const mockUser = {
  id: "user1",
  email: "test@example.com",
};
