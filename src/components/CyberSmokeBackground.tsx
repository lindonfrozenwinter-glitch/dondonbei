import { useEffect, useRef } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  phase: number;
  depth: number;
}

interface CyberSmokeBackgroundProps {
  width: number;
  height: number;
}

export default function CyberSmokeBackground({ width, height }: CyberSmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) return;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const particleCount = 600;
    const particles: SmokeParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const y = Math.random() * height;
      const xNorm = (Math.random() - 0.5) * 2;
      particles.push({
        x: width * 0.5 + xNorm * width * 0.15 + Math.sin(y * 0.005) * 30,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.3 - Math.random() * 0.5,
        baseSize: 3 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
        depth: y / height,
      });
    }

    let animId: number;

    function animate(time: number) {
      animId = requestAnimationFrame(animate);

      // Fade trail
      ctx.fillStyle = 'rgba(244, 228, 188, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const t = time * 0.001;

      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t + p.y * 0.01 + p.phase) * 0.2;

        const size = p.baseSize + Math.sin(t + p.phase) * p.baseSize * 0.4;

        // Two main columns with spread
        const columnOffset = Math.sin(p.x * 0.003) * 15;
        const spreadX = (1 - p.depth) * Math.sin(p.y * 0.008 + t) * 20;

        const px = p.x + columnOffset + spreadX;
        const py = p.y;

        // Color based on depth
        const r = Math.floor(0 + (1 - p.depth) * 20);
        const g = Math.floor(180 + p.depth * 40);
        const b = Math.floor(200 + p.depth * 55);
        const alpha = 0.15 + (1 - p.depth) * 0.15;

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Reset if out of bounds
        if (py < -20) {
          p.y = height + 20;
          p.x = width * 0.5 + (Math.random() - 0.5) * width * 0.2;
          p.depth = 1;
        }
        if (px < -50 || px > width + 50) {
          p.x = width * 0.5 + (Math.random() - 0.5) * width * 0.15;
        }
      }
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
