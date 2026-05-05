import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export default function OpeningSequence({ onComplete }: OpeningSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!canvas3DRef.current || !canvas2DRef.current || !containerRef.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // ===== Three.js Scene for Scroll Unroll =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0d17');

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas3DRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create parchment texture procedurally
    const parchmentCanvas = document.createElement('canvas');
    parchmentCanvas.width = 1024;
    parchmentCanvas.height = 512;
    const pCtx = parchmentCanvas.getContext('2d')!;

    // Base parchment color
    pCtx.fillStyle = '#f4e4bc';
    pCtx.fillRect(0, 0, 1024, 512);

    // Add noise/texture
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const alpha = Math.random() * 0.08;
      pCtx.fillStyle = `rgba(${139 + Math.random() * 30}, ${90 + Math.random() * 30}, ${43 + Math.random() * 20}, ${alpha})`;
      pCtx.fillRect(x, y, 2, 2);
    }

    // Draw Chinese title
    pCtx.fillStyle = '#2b1d0e';
    pCtx.font = 'bold 60px "Noto Serif SC", serif';
    pCtx.textAlign = 'center';
    pCtx.fillText('国庆水友赛', 512, 200);
    pCtx.font = '36px "Noto Serif SC", serif';
    pCtx.fillText('赛事细则', 512, 280);

    // Draw decorative lines
    pCtx.strokeStyle = 'rgba(43, 29, 14, 0.3)';
    pCtx.lineWidth = 2;
    pCtx.beginPath();
    pCtx.moveTo(350, 310);
    pCtx.lineTo(674, 310);
    pCtx.stroke();

    const parchmentTexture = new THREE.CanvasTexture(parchmentCanvas);

    // Create rolled paper geometry
    const segmentsW = 80;
    const segmentsH = 40;
    const geometry = new THREE.PlaneGeometry(6, 3, segmentsW, segmentsH);

    // Custom shader material for unroll effect
    const unrollMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: parchmentTexture },
        uProgress: { value: 0.0 },
        uRollRadius: { value: 0.3 },
        uSide: { value: 1.0 }, // 1 for front, -1 for back
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uRollRadius;
        uniform float uSide;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float rollWidth = 2.0 * 3.14159 * uRollRadius;
          float totalWidth = 6.0;
          float unrolledWidth = uProgress * totalWidth;

          // Determine if this vertex is in the rolled or unrolled part
          float xPos = pos.x + totalWidth * 0.5; // 0 to 6

          if (xPos > unrolledWidth) {
            // This part is still rolled
            float rolledLen = xPos - unrolledWidth;
            float angle = rolledLen / uRollRadius;

            // Spiral position
            float currentRadius = uRollRadius + 0.015 * angle;
            float cx = unrolledWidth - totalWidth * 0.5 + currentRadius;
            float cy = currentRadius * sin(angle);
            float cz = currentRadius * cos(angle);

            pos.x = cx - totalWidth * 0.5 + unrolledWidth;
            pos.y = cy;
            pos.z = cz;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uSide;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(uTexture, vUv);

          // Darken the back side
          if (uSide < 0.0) {
            color.rgb *= 0.6;
          }

          gl_FragColor = color;
        }
      `,
      side: THREE.DoubleSide,
    });

    const paperMesh = new THREE.Mesh(geometry, unrollMaterial);
    scene.add(paperMesh);

    // Add star particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 30;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ===== Canvas 2D Fire Effect =====
    const fireCanvas = canvas2DRef.current;
    fireCanvas.width = w;
    fireCanvas.height = h;
    const fCtx = fireCanvas.getContext('2d')!;

    interface FireParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }

    const particles: FireParticle[] = [];

    function createFireParticle(baseX: number, baseY: number) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
      const speed = 1 + Math.random() * 3;
      particles.push({
        x: baseX,
        y: baseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30 + Math.random() * 40,
        size: 2 + Math.random() * 6,
        color: Math.random() > 0.5 ? '#ff6b1a' : '#ff4500',
      });
    }

    function drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, time: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Main flame body
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
      gradient.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
      gradient.addColorStop(0.3, 'rgba(255, 100, 20, 0.7)');
      gradient.addColorStop(0.6, 'rgba(255, 60, 10, 0.4)');
      gradient.addColorStop(1, 'rgba(200, 30, 0, 0)');

      ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const wave = Math.sin(angle * 5 + time * 0.1) * 8;
        const r = 35 + wave + Math.sin(time * 0.05 + i) * 5;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r * 1.5 - 15;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner bright core
      const coreGrad = ctx.createRadialGradient(0, -5, 0, 0, -5, 20);
      coreGrad.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
      coreGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.6)');
      coreGrad.addColorStop(1, 'rgba(255, 150, 50, 0)');
      ctx.beginPath();
      ctx.arc(0, -5, 20, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.restore();
    }

    // Animation state
    let animId: number;
    const progressObj = { value: 0, fireOpacity: 1 };

    gsap.to(progressObj, {
      value: 1,
      duration: 3.5,
      ease: 'power2.inOut',
    });

    gsap.to(progressObj, {
      fireOpacity: 0,
      duration: 1.5,
      delay: 3.5,
      ease: 'power2.out',
      onComplete: () => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      },
    });

    // Camera animation
    gsap.to(camera.position, {
      z: 12,
      y: 0.5,
      duration: 4,
      ease: 'power2.inOut',
    });

    function animate(time: number) {
      animId = requestAnimationFrame(animate);

      // Update 3D
      unrollMaterial.uniforms.uProgress.value = progressObj.value;
      stars.rotation.y += 0.0003;
      renderer.render(scene, camera);

      // Update 2D fire
      fCtx.clearRect(0, 0, w, h);

      if (progressObj.fireOpacity > 0.01) {
        fCtx.globalAlpha = progressObj.fireOpacity;

        // Fire position follows the unrolling edge
        const unrolledWidth = progressObj.value * 6;
        const fireX = (w / 2) - (unrolledWidth * 0.5 - 3) * (w / 8);
        const fireY = h / 2;

        // Draw main flame
        drawFlame(fCtx, fireX, fireY, 1.5 + Math.sin(time * 0.003) * 0.2, time);

        // Spawn particles
        for (let i = 0; i < 3; i++) {
          createFireParticle(fireX + (Math.random() - 0.5) * 40, fireY + (Math.random() - 0.5) * 20);
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx + Math.sin(time * 0.005 + p.y * 0.01) * 0.5;
          p.y += p.vy - 0.5;
          p.life++;
          p.size *= 0.98;

          const lifeRatio = p.life / p.maxLife;
          if (lifeRatio >= 1) {
            particles.splice(i, 1);
            continue;
          }

          const alpha = 1 - lifeRatio;
          fCtx.beginPath();
          fCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          fCtx.fillStyle = `rgba(255, ${100 + lifeRatio * 100}, ${20}, ${alpha * 0.8})`;
          fCtx.fill();

          // Smoke
          if (lifeRatio > 0.5) {
            fCtx.beginPath();
            fCtx.arc(p.x + 10, p.y - 20, p.size * 2, 0, Math.PI * 2);
            fCtx.fillStyle = `rgba(80, 80, 80, ${(lifeRatio - 0.5) * 0.3})`;
            fCtx.fill();
          }
        }

        fCtx.globalAlpha = 1;
      }
    }

    animate(0);

    // Handle resize
    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      fireCanvas.width = nw;
      fireCanvas.height = nh;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      unrollMaterial.dispose();
      parchmentTexture.dispose();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvas3DRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <canvas
        ref={canvas2DRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
