'use client';

/**
 * 启动页 / Landing Page
 *
 * 页面目标：让首次访问用户快速理解网站是什么、能做什么，并引导进入灵感库
 * 视觉风格：轻盈、科技、灵感、实验室气质，深色背景 + 虹彩气泡
 * 核心动效：点击主按钮后，气泡从按钮处从小到大冒出并扩散
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Code2, ArrowRight } from 'lucide-react';
import BubbleBackground from './BubbleBackground';

/** 单个冒出气泡的数据结构 */
interface BurstBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  delay: number;
}

export default function LandingPage() {
  const router = useRouter();

  /** 是否已点击按钮，触发气泡冒出 */
  const [isBursting, setIsBursting] = useState(false);
  /** 冒出的气泡数组 */
  const [burstBubbles, setBurstBubbles] = useState<BurstBubble[]>([]);
  /** 按钮元素引用位置 */
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  /**
   * 生成随机冒出气泡
   */
  const generateBurstBubbles = useCallback((centerX: number, centerY: number): BurstBubble[] => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
      const dist = 80 + Math.random() * 300;
      return {
        id: Date.now() + i,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        size: 20 + Math.random() * 80,
        hue: 260 + Math.random() * 80,
        delay: Math.random() * 0.3,
      };
    });
  }, []);

  /**
   * 点击主按钮：记录位置 → 生成气泡 → 播放动画 → 跳转页面
   */
  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setBtnPos({ x: centerX, y: centerY });

      const bubbles = generateBurstBubbles(centerX, centerY);
      setBurstBubbles(bubbles);
      setIsBursting(true);

      // 气泡动画完成后跳转（约 1.2s）
      setTimeout(() => {
        router.push('/gallery');
      }, 1200);
    },
    [router, generateBurstBubbles]
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050510] text-white flex flex-col items-center justify-center">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0) rotate(-20deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes burstBubbleAnim {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          50% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.2); opacity: 0.9; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Canvas 气泡粒子背景 */}
      <BubbleBackground />

      {/* 中心内容区 */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >
        {/* Logo：彩色气泡 */}
        <div
          className="mb-6 relative"
          style={{ animation: 'popIn 0.6s ease-out 0.2s forwards', opacity: 0 }}
        >
          <div className="w-20 h-20 rounded-full relative"
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(200,180,255,0.9), rgba(150,100,255,0.5) 40%, rgba(80,40,180,0.3) 70%, transparent 100%)',
              boxShadow: '0 0 30px rgba(150,100,255,0.4), inset 0 0 20px rgba(255,255,255,0.15)',
            }}
          >
            <div
              className="absolute top-3 left-3 w-6 h-4 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.7), transparent 70%)',
                transform: 'rotate(-30deg)',
              }}
            />
          </div>
        </div>

        {/* 网站名称 */}
        <div
          className="mb-2 flex items-center gap-2 text-sm tracking-widest text-white/50 uppercase"
          style={{ animation: 'fadeIn 0.6s ease-out 0.4s forwards', opacity: 0 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>灵感泡泡</span>
          <span className="text-white/30">|</span>
          <span>Vibe Bubble</span>
        </div>

        {/* 主标题 */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.5s forwards', opacity: 0 }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 30%, #60a5fa 60%, #38bdf8 100%)',
            }}
          >
            Vibe bubble
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-white/70 mb-8 font-light tracking-wide"
          style={{ animation: 'fadeIn 0.6s ease-out 0.7s forwards', opacity: 0 }}
        >
          Discover what people are building with AI.
        </p>

        {/* 简短介绍 */}
        <p
          className="text-sm md:text-base text-white/50 max-w-md mb-10 leading-relaxed"
          style={{ animation: 'fadeIn 0.6s ease-out 0.9s forwards', opacity: 0 }}
        >
          一个收集真实 Vibe Coding 案例的灵感库，
          <br />
          帮你发现灵感，动手实现你自己的小项目。
        </p>

        {/* 主按钮 */}
        <button
          onClick={handleEnter}
          disabled={isBursting}
          className="group relative px-8 py-4 rounded-full text-base font-medium transition-all duration-300 disabled:opacity-80 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.2))',
            border: '1px solid rgba(139,92,246,0.4)',
            boxShadow: '0 0 20px rgba(139,92,246,0.15)',
            animation: 'fadeInUp 0.6s ease-out 1.1s forwards',
            opacity: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.3)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
          }}
        >
          <span className="flex items-center gap-2 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #c4b5fd, #38bdf8)',
            }}
          >
            看看大家用AI做了什么？
            <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* 开发者介绍入口 */}
      <a
        href="https://github.com/VincentJade1990/vibe-inspire-gallery"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        style={{ animation: 'fadeIn 0.6s ease-out 1.5s forwards', opacity: 0 }}
      >
        <Code2 className="w-3.5 h-3.5" />
        <span>开发者介绍</span>
      </a>

      {/* 气泡冒出动画层 */}
      {isBursting && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {burstBubbles.map((b) => {
            const tx = b.x - btnPos.x;
            const ty = b.y - btnPos.y;
            return (
              <div
                key={b.id}
                className="absolute rounded-full"
                style={{
                  left: btnPos.x,
                  top: btnPos.y,
                  width: b.size,
                  height: b.size,
                  marginLeft: -b.size / 2,
                  marginTop: -b.size / 2,
                  background: `radial-gradient(circle at 35% 35%, hsla(${b.hue},80%,85%,0.8), hsla(${b.hue + 20},70%,60%,0.4) 45%, hsla(${b.hue + 40},60%,40%,0.1) 70%, transparent)`,
                  boxShadow: `0 0 ${b.size * 0.6}px hsla(${b.hue},60%,60%,0.3), inset 0 0 ${b.size * 0.3}px rgba(255,255,255,0.2)`,
                  '--tx': `${tx}px`,
                  '--ty': `${ty}px`,
                  animation: `burstBubbleAnim 1.2s ease-out ${b.delay}s forwards`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
