'use client';

/**
 * 启动页 Canvas 气泡粒子背景
 * 绘制半透明虹彩气泡缓慢浮动，营造轻盈科技氛围
 */

import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  phase: number;
}

export default function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let bubbles: Bubble[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBubbles();
    };

    const initBubbles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 25000);
      bubbles = Array.from({ length: Math.min(count, 60) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 10,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        opacity: Math.random() * 0.25 + 0.05,
        hue: Math.random() * 60 + 260,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const drawBubble = (b: Bubble, time: number) => {
      const wobble = Math.sin(time * 0.001 + b.phase) * 2;
      const r = b.radius + wobble;

      const grad = ctx.createRadialGradient(
        b.x - r * 0.3, b.y - r * 0.3, 0,
        b.x, b.y, r
      );
      grad.addColorStop(0, `hsla(${b.hue}, 80%, 75%, ${b.opacity * 0.6})`);
      grad.addColorStop(0.4, `hsla(${b.hue + 20}, 70%, 60%, ${b.opacity * 0.3})`);
      grad.addColorStop(0.8, `hsla(${b.hue + 40}, 60%, 50%, ${b.opacity * 0.15})`);
      grad.addColorStop(1, `hsla(${b.hue + 60}, 50%, 40%, 0)`);

      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        b.x - r * 0.35, b.y - r * 0.35,
        r * 0.25, r * 0.15,
        -Math.PI / 4, 0, Math.PI * 2
      );
      ctx.fillStyle = `hsla(${b.hue}, 30%, 95%, ${b.opacity * 0.5})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${b.hue}, 60%, 70%, ${b.opacity * 0.3})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((b) => {
        b.x += b.speedX + Math.sin(time * 0.0005 + b.phase) * 0.2;
        b.y += b.speedY;
        if (b.y < -b.radius * 2) {
          b.y = canvas.height + b.radius * 2;
          b.x = Math.random() * canvas.width;
        }
        if (b.x < -b.radius) b.x = canvas.width + b.radius;
        if (b.x > canvas.width + b.radius) b.x = -b.radius;
        drawBubble(b, time);
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
