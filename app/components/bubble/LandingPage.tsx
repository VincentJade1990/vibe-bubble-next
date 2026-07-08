'use client';

/**
 * 启动页 / Landing Page
 *
 * 页面目标：让首次访问用户快速理解网站是什么、能做什么，并引导进入灵感库
 * 视觉风格：轻盈、科技、灵感、实验室气质，深色背景 + 虹彩气泡
 * 核心动效：点击主按钮后，气泡从按钮处从小到大冒出并扩散
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      {/* Canvas 气泡粒子背景 */}
      <BubbleBackground />

      {/* 中心内容区 */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo：彩色气泡 */}
        <motion.div
          className="mb-6 relative"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
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
        </motion.div>

        {/* 网站名称 */}
        <motion.div
          className="mb-2 flex items-center gap-2 text-sm tracking-widest text-white/50 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>灵感泡泡</span>
          <span className="text-white/30">|</span>
          <span>Vibe Bubble</span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 30%, #60a5fa 60%, #38bdf8 100%)',
            }}
          >
            Vibe bubble
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/70 mb-8 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Discover what people are building with AI.
        </motion.p>

        {/* 简短介绍 */}
        <motion.p
          className="text-sm md:text-base text-white/50 max-w-md mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          一个收集真实 Vibe Coding 案例的灵感库，
          <br />
          帮你发现灵感，动手实现你自己的小项目。
        </motion.p>

        {/* 主按钮 */}
        <motion.button
          onClick={handleEnter}
          disabled={isBursting}
          className="group relative px-8 py-4 rounded-full text-base font-medium transition-all duration-300 disabled:opacity-80"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.2))',
            border: '1px solid rgba(139,92,246,0.4)',
            boxShadow: '0 0 20px rgba(139,92,246,0.15)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring' }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 40px rgba(139,92,246,0.3)',
            borderColor: 'rgba(139,92,246,0.7)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #c4b5fd, #38bdf8)',
            }}
          >
            看看大家用AI做了什么？
            <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </motion.div>

      {/* 开发者介绍入口 */}
      <motion.a
        href="https://github.com/VincentJade1990/vibe-inspire-gallery"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Code2 className="w-3.5 h-3.5" />
        <span>开发者介绍</span>
      </motion.a>

      {/* 气泡冒出动画层 */}
      <AnimatePresence>
        {isBursting && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {burstBubbles.map((b) => (
              <motion.div
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
                }}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [1, 0.9, 0],
                  x: b.x - btnPos.x,
                  y: b.y - btnPos.y,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: b.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
