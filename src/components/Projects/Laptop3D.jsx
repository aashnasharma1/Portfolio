'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { getLaptopEngine } from './laptopEngine';

/**
 * One card's view of the shared 3D laptop. Yaw is read from `rotation.ry`
 * whenever `api.render()` is called, so scroll animations can drive it.
 * Without WebGL it falls back to a flat framed screenshot.
 */
export default function Laptop3D({ image, rotation, onReady }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    getLaptopEngine().then((engine) => {
      if (disposed) return;
      if (!engine) {
        setState('fallback');
        return;
      }

      const host = hostRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!host || !ctx) {
        setState('fallback');
        return;
      }
      // Lower pixel ratio on phones keeps GPU memory modest
      const dpr = Math.min(window.devicePixelRatio || 1, engine.phone ? 1.75 : 2);

      const render = () => {
        engine.renderInto(ctx, canvas.width, canvas.height, image, rotation?.ry ?? -0.2);
      };

      const resize = () => {
        const w = Math.round(host.clientWidth * dpr);
        const h = Math.round(host.clientHeight * dpr);
        if (!w || !h) return;
        canvas.width = w;
        canvas.height = h;
        render();
      };

      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      const offTexture = engine.onTexture((loaded) => {
        if (loaded === image) render();
      });

      setState('ready');
      onReady?.({ render });

      cleanup = () => {
        ro.disconnect();
        offTexture();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  if (state === 'fallback') {
    return (
      <div className={`${styles.canvasHost} ${styles.canvasReady}`} aria-hidden="true">
        <div className={styles.fallback}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/projects/${image}`} alt="" loading="lazy" />
        </div>
      </div>
    );
  }

  return (
    <div ref={hostRef} className={`${styles.canvasHost} ${state === 'ready' ? styles.canvasReady : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
