'use client';

/**
 * 气泡画布组件（适配 Next.js + Supabase）
 * 基于 Framer Motion + 自定义物理引擎实现气泡漂浮、碰撞、破碎粒子动效
 */

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { CaseItem } from '@/app/lib/bubble-types';
import { PLATFORM_NAMES } from '@/app/lib/bubble-types';

interface BubbleCanvasProps {
  cases: CaseItem[];
}

type BubbleTier = 'S' | 'A' | 'B' | 'monthly';

interface BubbleState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  tier: BubbleTier;
  caseItem: CaseItem;
  isBroken: boolean;
  rebornAt: number;
  breatheScale: number;
}

interface ParticleState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;

const TIER_CONFIG: Record<BubbleTier, { minSize: number; maxSize: number; color: string; glowColor: string; opacity: number }> = {
  monthly: { minSize: 180, maxSize: 220, color: 'rgba(14,165,233,0.25)', glowColor: 'rgba(56,189,248,0.6)', opacity: 0.9 },
  S: { minSize: 120, maxSize: 160, color: 'rgba(14,165,233,0.2)', glowColor: 'rgba(56,189,248,0.5)', opacity: 0.85 },
  A: { minSize: 80, maxSize: 110, color: 'rgba(255,255,255,0.6)', glowColor: 'rgba(148,163,184,0.2)', opacity: 0.75 },
  B: { minSize: 50, maxSize: 70, color: 'rgba(226,232,240,0.5)', glowColor: 'rgba(203,213,225,0.15)', opacity: 0.6 },
};

function getTier(caseItem: CaseItem, isMonthly: boolean): BubbleTier {
  if (isMonthly) return 'monthly';
  if (caseItem.heatScore >= 85) return 'S';
  if (caseItem.heatScore >= 60) return 'A';
  return 'B';
}

function randomVelocity(base: number = 0.3): number {
  return (Math.random() - 0.5) * base * 2;
}

function generateParticles(x: number, y: number, size: number, color: string): ParticleState[] {
  const count = 12 + Math.floor(Math.random() * 8);
  const particles: ParticleState[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      id: `p-${Date.now()}-${i}`,
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 6,
      color,
      opacity: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20,
    });
  }
  return particles;
}

function initBubbles(cases: CaseItem[]): BubbleState[] {
  if (cases.length === 0) return [];
  const monthlyCase = cases.reduce((max, c) => (c.heatScore > max.heatScore ? c : max), cases[0]);

  return cases.map((caseItem, index) => {
    const isMonthly = caseItem.id === monthlyCase.id;
    const tier = getTier(caseItem, isMonthly);
    const config = TIER_CONFIG[tier];
    const size = config.minSize + Math.random() * (config.maxSize - config.minSize);

    let x: number, y: number;
    if (isMonthly) {
      x = WORLD_WIDTH / 2 + (Math.random() - 0.5) * 100;
      y = WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 100;
    } else {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const spiralRadius = 200 + Math.sqrt(index) * 60;
      const angle = index * goldenAngle;
      x = WORLD_WIDTH / 2 + Math.cos(angle) * spiralRadius + (Math.random() - 0.5) * 80;
      y = WORLD_HEIGHT / 2 + Math.sin(angle) * spiralRadius + (Math.random() - 0.5) * 80;
    }

    x = Math.max(size / 2, Math.min(WORLD_WIDTH - size / 2, x));
    y = Math.max(size / 2, Math.min(WORLD_HEIGHT - size / 2, y));

    return {
      id: caseItem.id,
      x, y,
      vx: randomVelocity(0.4),
      vy: randomVelocity(0.4),
      size,
      tier,
      caseItem,
      isBroken: false,
      rebornAt: 0,
      breatheScale: 1,
    };
  });
}

export default function BubbleCanvas({ cases }: BubbleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const bubblesRef = useRef<BubbleState[]>([]);
  const particlesRef = useRef<ParticleState[]>([]);
  const lastTimeRef = useRef<number>(0);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [previewCase, setPreviewCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    const newBubbles = initBubbles(cases);
    bubblesRef.current = newBubbles;
    setBubbles(newBubbles);
    const container = containerRef.current;
    if (container) {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      setOffset({ x: (cw - WORLD_WIDTH) / 2, y: (ch - WORLD_HEIGHT) / 2 });
    }
  }, [cases]);

  const physicsLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - lastTimeRef.current) / 16.67, 3);
    lastTimeRef.current = timestamp;

    const currentBubbles = bubblesRef.current;
    const currentParticles = particlesRef.current;
    let hasChange = false;

    for (let i = 0; i < currentBubbles.length; i++) {
      const b = currentBubbles[i];
      if (b.isBroken) continue;

      b.vx += randomVelocity(0.02) * dt;
      b.vy += randomVelocity(0.02) * dt;
      b.vx *= 0.995;
      b.vy *= 0.995;

      const maxSpeed = b.tier === 'monthly' ? 0.3 : b.tier === 'S' ? 0.5 : 0.8;
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > maxSpeed) {
        b.vx = (b.vx / speed) * maxSpeed;
        b.vy = (b.vy / speed) * maxSpeed;
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      const half = b.size / 2;
      if (b.x < half) { b.x = half; b.vx *= -0.8; }
      if (b.x > WORLD_WIDTH - half) { b.x = WORLD_WIDTH - half; b.vx *= -0.8; }
      if (b.y < half) { b.y = half; b.vy *= -0.8; }
      if (b.y > WORLD_HEIGHT - half) { b.y = WORLD_HEIGHT - half; b.vy *= -0.8; }

      if (b.tier === 'S' || b.tier === 'monthly') {
        const breatheSpeed = b.tier === 'monthly' ? 0.0015 : 0.002;
        b.breatheScale = 1 + Math.sin(timestamp * breatheSpeed) * 0.05;
      }
      hasChange = true;
    }

    for (let i = 0; i < currentBubbles.length; i++) {
      const b1 = currentBubbles[i];
      if (b1.isBroken) continue;
      for (let j = i + 1; j < currentBubbles.length; j++) {
        const b2 = currentBubbles[j];
        if (b2.isBroken) continue;
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (b1.size + b2.size) / 2 + 8;
        if (dist < minDist && dist > 0) {
          const force = (minDist - dist) * 0.015 * dt;
          const nx = dx / dist;
          const ny = dy / dist;
          const m1 = b1.size * b1.size;
          const m2 = b2.size * b2.size;
          const totalM = m1 + m2;
          b1.vx -= nx * force * (m2 / totalM);
          b1.vy -= ny * force * (m2 / totalM);
          b2.vx += nx * force * (m1 / totalM);
          b2.vy += ny * force * (m1 / totalM);
          hasChange = true;
        }
      }
    }

    for (let i = currentParticles.length - 1; i >= 0; i--) {
      const p = currentParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += 0.05 * dt;
      p.rotation += p.rotationSpeed * dt;
      p.opacity -= 0.02 * dt;
      if (p.opacity <= 0) {
        currentParticles.splice(i, 1);
        hasChange = true;
      } else {
        hasChange = true;
      }
    }

    if (hasChange) {
      setBubbles([...currentBubbles]);
      setParticles([...currentParticles]);
    }
    rafRef.current = requestAnimationFrame(physicsLoop);
  }, []);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(physicsLoop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [physicsLoop]);

  const scheduleReborn = useCallback((bubbleId: string) => {
    const delay = 3000 + Math.random() * 4000;
    setTimeout(() => {
      bubblesRef.current = bubblesRef.current.map((b) => {
        if (b.id === bubbleId) {
          const edge = Math.floor(Math.random() * 4);
          let nx = b.x, ny = b.y;
          const half = b.size / 2;
          switch (edge) {
            case 0: nx = half; ny = Math.random() * WORLD_HEIGHT; break;
            case 1: nx = WORLD_WIDTH - half; ny = Math.random() * WORLD_HEIGHT; break;
            case 2: nx = Math.random() * WORLD_WIDTH; ny = half; break;
            case 3: nx = Math.random() * WORLD_WIDTH; ny = WORLD_HEIGHT - half; break;
          }
          return { ...b, x: nx, y: ny, vx: randomVelocity(1), vy: randomVelocity(1), isBroken: false };
        }
        return b;
      });
      setBubbles([...bubblesRef.current]);
    }, delay);
  }, []);

  const handleBubbleClick = useCallback((bubble: BubbleState) => {
    if (bubble.isBroken) return;
    const config = TIER_CONFIG[bubble.tier];
    const newParticles = generateParticles(bubble.x, bubble.y, bubble.size, config.glowColor);
    particlesRef.current = [...particlesRef.current, ...newParticles];
    setParticles([...particlesRef.current]);
    bubblesRef.current = bubblesRef.current.map((b) =>
      b.id === bubble.id ? { ...b, isBroken: true } : b
    );
    setBubbles([...bubblesRef.current]);
    setPreviewCase(bubble.caseItem);
    scheduleReborn(bubble.id);
  }, [scheduleReborn]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setScale((prev) => Math.max(0.3, Math.min(4, prev * delta)));
  }, []);

  const worldToScreen = useCallback((wx: number, wy: number) => {
    return { x: wx * scale + offset.x, y: wy * scale + offset.y };
  }, [scale, offset]);

  const screenParticles = useMemo(() => {
    return particles.map((p) => ({ ...p, ...worldToScreen(p.x, p.y) }));
  }, [particles, worldToScreen]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a] select-none touch-none"
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: `${100 * scale}px ${100 * scale}px`,
          transform: `translate(${offset.x % (100 * scale)}px, ${offset.y % (100 * scale)}px)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <AnimatePresence>
          {bubbles.map((bubble) => {
            if (bubble.isBroken) return null;
            const config = TIER_CONFIG[bubble.tier];
            const actualSize = bubble.size * (bubble.tier === 'S' || bubble.tier === 'monthly' ? bubble.breatheScale : 1);

            return (
              <motion.div
                key={bubble.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, x: bubble.x - actualSize / 2, y: bubble.y - actualSize / 2 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ opacity: { duration: 0.3 }, scale: { type: 'spring', stiffness: 300, damping: 25 }, x: { duration: 0 }, y: { duration: 0 } }}
                className="absolute rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
                style={{
                  width: actualSize,
                  height: actualSize,
                  background: config.color,
                  boxShadow: bubble.tier === 'S' || bubble.tier === 'monthly'
                    ? `0 0 ${bubble.tier === 'monthly' ? 50 : 30}px ${config.glowColor}, inset 0 0 20px rgba(255,255,255,0.15)`
                    : `0 2px 8px rgba(0,0,0,0.08)`,
                  border: bubble.tier === 'A' || bubble.tier === 'B'
                    ? '1px solid rgba(255,255,255,0.1)'
                    : `1px solid ${config.glowColor}`,
                  backdropFilter: 'blur(4px)',
                }}
                onClick={() => handleBubbleClick(bubble)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {(bubble.tier === 'S' || bubble.tier === 'monthly') && (
                  <img
                    src={bubble.caseItem.coverImage}
                    alt=""
                    className="absolute inset-1 rounded-full object-cover opacity-40 pointer-events-none"
                    draggable={false}
                  />
                )}
                <div className="relative z-10 text-center px-1.5 pointer-events-none">
                  <span className={`text-[10px] font-bold leading-tight ${
                    bubble.tier === 'S' || bubble.tier === 'monthly' ? 'text-white drop-shadow-md' : 'text-slate-300'
                  }`}>
                    {bubble.caseItem.title.slice(0, bubble.tier === 'monthly' ? 8 : bubble.tier === 'S' ? 5 : 3)}
                  </span>
                  <span className={`block text-[9px] mt-0.5 ${
                    bubble.tier === 'S' || bubble.tier === 'monthly' ? 'text-white/70' : 'text-slate-500'
                  }`}>
                    {PLATFORM_NAMES[bubble.caseItem.platform] || bubble.caseItem.platform}
                  </span>
                </div>
                {bubble.tier === 'monthly' && (
                  <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-sky-500 text-white text-[9px] font-bold shadow-lg">
                    精选
                  </div>
                )}
                {(bubble.tier === 'S' || bubble.tier === 'monthly') && (
                  <motion.div
                    className="absolute inset-[-4px] rounded-full pointer-events-none"
                    style={{ border: `2px solid ${config.glowColor}` }}
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
                    transition={{ duration: bubble.tier === 'monthly' ? 2.5 : 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {screenParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1, rotate: p.rotation }}
            animate={{ opacity: p.opacity, scale: 0.2, rotate: p.rotation + p.rotationSpeed * 10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="absolute pointer-events-none"
            style={{
              left: p.x, top: p.y,
              width: p.size * scale, height: p.size * scale,
              background: p.color,
              borderRadius: '30%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setScale((s) => Math.min(4, s + 0.25))}
          className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white hover:border-purple-500/50 shadow-md">
          +
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setScale((s) => Math.max(0.3, s - 0.25))}
          className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white hover:border-purple-500/50 shadow-md">
          -
        </motion.button>
      </div>

      <div className="absolute top-3 right-3 text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md backdrop-blur-sm z-10">
        {(scale * 100).toFixed(0)}%
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 bg-slate-800/80 px-3 py-2 rounded-lg backdrop-blur-sm z-10 space-y-0.5">
        <p>单击气泡：预览详情</p>
        <p>滚轮：缩放画布</p>
      </div>

      <AnimatePresence>
        {previewCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setPreviewCase(null)}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="w-96 max-w-[92vw] bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-44">
                <img src={previewCase.coverImage} alt={previewCase.title} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button onClick={() => setPreviewCase(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-bold text-white text-lg drop-shadow-md">{previewCase.title}</h4>
                  <p className="text-xs text-white/80 mt-0.5">{PLATFORM_NAMES[previewCase.platform] || previewCase.platform}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {previewCase.sceneTags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">{tag}</span>
                  ))}
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-medium mb-1">简介</p>
                  <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">{previewCase.description || previewCase.prompt}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-purple-500/10 transition-colors">
                    <Heart className="w-4 h-4" /> 点赞
                  </button>
                  <Link href={`/inspiration/${previewCase.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 transition-colors">
                    <ExternalLink className="w-4 h-4" /> 详情
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
