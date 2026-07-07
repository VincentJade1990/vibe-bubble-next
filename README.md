# Vibe Bubble - Next.js 全栈版

基于 Next.js 14 + TypeScript + Tailwind CSS + Supabase 的灵感库全栈应用。

## 项目结构

```
vibe-bubble-next/
├── app/
│   ├── actions/          # Server Actions（业务逻辑）
│   │   ├── auth.ts       # 认证相关
│   │   ├── candidates.ts # 候选池管理
│   │   ├── comments.ts   # 评论管理
│   │   ├── inspirations.ts # 灵感库管理
│   │   ├── interactions.ts # 点赞/收藏/评论
│   │   ├── profile.ts    # 用户资料
│   │   └── submissions.ts # 投稿管理
│   ├── admin/            # 后台管理页面
│   │   ├── login/        # 管理员登录
│   │   ├── candidates/   # 候选池
│   │   ├── inspirations/ # 灵感库
│   │   ├── submissions/  # 投稿管理
│   │   ├── comments/     # 评论审核
│   │   ├── layout.tsx    # 后台布局（权限检查）
│   │   └── page.tsx      # Dashboard
│   ├── api/
│   │   └── parse-url/    # URL 元数据解析 API
│   ├── gallery/          # 前台灵感列表
│   ├── inspiration/
│   │   └── [slug]/       # 灵感详情页 + 互动
│   ├── login/            # 用户登录
│   ├── register/         # 用户注册
│   ├── profile/          # 个人中心
│   ├── random/           # 随机灵感
│   ├── submit/           # 用户投稿
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页（重定向到 gallery）
├── lib/
│   ├── supabase/         # Supabase 客户端
│   │   ├── client.ts     # 浏览器端
│   │   ├── server.ts     # 服务端
│   │   └── admin.ts      # Admin（绕过 RLS）
│   └── utils.ts          # 工具函数
├── types/
│   └── database.ts       # 数据库类型定义
├── middleware.ts         # Session 刷新中间件
└── .env.local.example    # 环境变量模板
```

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 信息：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon/public key
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
```

### 3. 创建管理员账号

1. 启动开发服务器后访问 `http://localhost:3000/register` 注册一个用户
2. 在 Supabase Dashboard → SQL Editor 中执行：

```sql
UPDATE profiles SET role = 'admin' WHERE id = '你的用户UUID';
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`

## 路由列表

| 路由 | 说明 |
|---|---|
| `/` | 首页（重定向到灵感库） |
| `/gallery` | 灵感列表 |
| `/inspiration/[slug]` | 灵感详情 + 点赞/收藏/评论 |
| `/random` | 随机灵感 |
| `/submit` | 用户投稿 |
| `/login` | 用户登录 |
| `/register` | 用户注册 |
| `/profile` | 个人中心 |
| `/admin/login` | 管理员登录 |
| `/admin` | 后台 Dashboard |
| `/admin/candidates` | 候选池管理 |
| `/admin/inspirations` | 灵感库管理 |
| `/admin/submissions` | 投稿管理 |
| `/admin/comments` | 评论审核 |

## 数据库说明

项目使用 Supabase PostgreSQL，包含以下表：
- `inspirations` - 灵感内容
- `candidates` - 候选池（爬虫抓取/手动添加）
- `submissions` - 用户投稿
- `profiles` - 用户资料
- `comments` - 评论
- `likes` - 点赞
- `favorites` - 收藏
- `sources` - 来源平台
- `tags` - 标签

详见项目根目录的 `docs/schema.sql`。
