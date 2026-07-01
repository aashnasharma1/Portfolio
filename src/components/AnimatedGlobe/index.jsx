"use client";
import { useEffect, useRef } from "react";
import styles from "./style.module.scss";

export default function AnimatedGlobe() {
  const canvasRef = useRef(null);
  const sphereRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    class NebulaSphere {
      constructor(canvas, options = {}) {
        this.canvas = canvas;
        if (!this.canvas) return;

        // Configuration
        this.config = {
          particleCount: 800,
          baseRadius: 30,
          interactionRadius: 80,
          warpStrength: 8,
          rotationSpeed: 0.3,
          colorTheme: "cyan",
          hoverType: "attract",
          ...options,
        };

        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.mouse = { x: 0, y: 0, isActive: false };

        // Physics Constants
        this.SPRING = 0.05;
        this.FRICTION = 0.9;
        this.Z_PERSPECTIVE = 800;

        this.init();
        this.bindEvents();
        this.animate();
      }

      init() {
        this.resize();
        this.particles = [];
        const { particleCount, baseRadius } = this.config;

        for (let i = 0; i < particleCount; i++) {
          // Spherical distribution
          const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const x = baseRadius * Math.sin(phi) * Math.cos(theta);
          const y = baseRadius * Math.sin(phi) * Math.sin(theta);
          const z = baseRadius * Math.cos(phi);

          this.particles.push({
            baseX: x,
            baseY: y,
            baseZ: z,
            x: x,
            y: y,
            z: z,
            vx: 0,
            vy: 0,
            vz: 0,
            size: Math.random() * 0.8 + 0.3,
            alpha: Math.random() * 0.5 + 0.5,
          });
        }
      }

      resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
      }

      bindEvents() {
        this.resizeHandler = () => this.resize();
        window.addEventListener("resize", this.resizeHandler);

        const onMove = (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          this.mouse.x = clientX - rect.left;
          this.mouse.y = clientY - rect.top;
          this.mouse.isActive = true;
        };

        const onLeave = () => {
          this.mouse.isActive = false;
        };

        this.canvas.addEventListener("mousemove", onMove);
        this.canvas.addEventListener("touchmove", onMove, { passive: false });
        this.canvas.addEventListener("mouseleave", onLeave);
        this.canvas.addEventListener("touchend", onLeave);

        this.moveHandler = onMove;
        this.leaveHandler = onLeave;
      }

      animate() {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const cx = width / 2;
        const cy = height / 2;

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.globalCompositeOperation = "lighter";

        // Theme Colors
        let r = 240,
          g = 240,
          b = 240;
        if (this.config.colorTheme === "purple") {
          r = 200;
          g = 100;
          b = 255;
        } else if (this.config.colorTheme === "fire") {
          r = 255;
          g = 100;
          b = 50;
        } else if (this.config.colorTheme === "white") {
          r = 220;
          g = 220;
          b = 220;
        } else if (this.config.colorTheme === "cyan") {
          r = 100;
          g = 200;
          b = 255;
        }

        const time = Date.now() * 0.001 * this.config.rotationSpeed;

        // Mouse Rotation Influence
        const mouseRelX = this.mouse.x - cx;
        const mouseRelY = this.mouse.y - cy;
        const rotX = this.mouse.isActive ? mouseRelY * 0.0001 : 0;
        const rotY = this.mouse.isActive ? mouseRelX * 0.0001 : 0;

        this.particles.forEach((p) => {
          // 1. Rotation
          let tx = p.baseX * Math.cos(time) - p.baseZ * Math.sin(time);
          let tz = p.baseX * Math.sin(time) + p.baseZ * Math.cos(time);
          let ty = p.baseY;

          // Mouse Tilt
          if (this.mouse.isActive) {
            let mx = tx * Math.cos(rotY) - tz * Math.sin(rotY);
            let mz = tx * Math.sin(rotY) + tz * Math.cos(rotY);
            tx = mx;
            tz = mz;
            let my = ty * Math.cos(rotX) - tz * Math.sin(rotX);
            mz = ty * Math.sin(rotX) + tz * Math.cos(rotX);
            ty = my;
            tz = mz;
          }

          // 2. Physics (Spring)
          p.vx += (tx - p.x) * this.SPRING;
          p.vy += (ty - p.y) * this.SPRING;
          p.vz += (tz - p.z) * this.SPRING;

          // 3. Interaction
          const scale = this.Z_PERSPECTIVE / (this.Z_PERSPECTIVE + p.z);
          const sx = cx + p.x * scale;
          const sy = cy + p.y * scale;

          if (this.mouse.isActive) {
            const dx = sx - this.mouse.x;
            const dy = sy - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.config.interactionRadius) {
              const force =
                (this.config.interactionRadius - dist) /
                this.config.interactionRadius;
              const angle = Math.atan2(dy, dx);
              let fx = 0,
                fy = 0,
                fz = 0;
              const str = this.config.warpStrength;

              if (this.config.hoverType === "attract") {
                fx = -Math.cos(angle) * force * str;
                fy = -Math.sin(angle) * force * str;
                fz = force * str * 0.5;
              } else if (this.config.hoverType === "swirl") {
                fx = -Math.sin(angle) * force * str;
                fy = Math.cos(angle) * force * str;
              } else {
                // Repel
                fx = Math.cos(angle) * force * str;
                fy = Math.sin(angle) * force * str;
                fz = -force * str * 0.5;
              }

              p.vx += fx;
              p.vy += fy;
              p.vz += fz;
            }
          }

          // Apply
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.vx *= this.FRICTION;
          p.vy *= this.FRICTION;
          p.vz *= this.FRICTION;

          // 4. Draw
          const finalScale = this.Z_PERSPECTIVE / (this.Z_PERSPECTIVE + p.z);
          if (p.z > -this.Z_PERSPECTIVE + 10 && finalScale > 0) {
            const alpha = Math.min(
              1,
              Math.max(0.1, finalScale * p.alpha - p.z / 1000)
            );
            this.ctx.beginPath();
            this.ctx.arc(
              cx + p.x * finalScale,
              cy + p.y * finalScale,
              p.size * finalScale,
              0,
              Math.PI * 2
            );
            this.ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            this.ctx.fill();
          }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener("resize", this.resizeHandler);
        if (this.canvas) {
          this.canvas.removeEventListener("mousemove", this.moveHandler);
          this.canvas.removeEventListener("touchmove", this.moveHandler);
          this.canvas.removeEventListener("mouseleave", this.leaveHandler);
          this.canvas.removeEventListener("touchend", this.leaveHandler);
        }
      }
    }

    // Initialize sphere
    sphereRef.current = new NebulaSphere(canvasRef.current, {
      particleCount: 450,
      baseRadius: 30,
      rotationSpeed: 0.3,
      colorTheme: "dark",
      hoverType: "repel",
      interactionRadius: 15,
      warpStrength: 1,
    });

    // Force multiple resizes to catch CSS layout settling
    const resizeDelays = [0, 50, 150, 300];
    const timeouts = resizeDelays.map(delay => 
      setTimeout(() => {
        if (sphereRef.current) {
          sphereRef.current.resize();
        }
      }, delay)
    );

    // Cleanup
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      if (sphereRef.current) {
        sphereRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.digitalBall}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
