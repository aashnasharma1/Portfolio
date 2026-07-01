'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './style.module.scss';

const pxFactorValues = [1, 2, 4, 9, 100];

const PixelatedImage = ({ src, alt, className, delay = 0, startAnimation = true }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [delayComplete, setDelayComplete] = useState(delay === 0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pxIndexRef = useRef(0);
  const animatingRef = useRef(false);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      setIsLoaded(true);
    };
  }, [src]);

  // Intersection observer
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [isInView]);

  // Render function - draws image at specified pixelation level
  const renderAtLevel = useCallback((pixelLevel) => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!canvas || !wrapper || !img) return;

    const dpr = window.devicePixelRatio || 1;
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperHeight = wrapper.offsetHeight;
    
    // Skip if wrapper has no dimensions
    if (wrapperWidth === 0 || wrapperHeight === 0) return;

    // Set canvas size
    canvas.width = wrapperWidth * dpr;
    canvas.height = wrapperHeight * dpr;
    canvas.style.width = `${wrapperWidth}px`;
    canvas.style.height = `${wrapperHeight}px`;

    const ctx = canvas.getContext('2d');
    const offsetWidth = wrapperWidth * dpr;
    const offsetHeight = wrapperHeight * dpr;
    const imgRatio = img.width / img.height;
    const containerRatio = offsetWidth / offsetHeight;

    let drawWidth, drawHeight, drawX, drawY;

    // Cover behavior
    if (containerRatio > imgRatio) {
      drawWidth = offsetWidth;
      drawHeight = offsetWidth / imgRatio;
      drawX = 0;
      drawY = (offsetHeight - drawHeight) / 2;
    } else {
      drawHeight = offsetHeight;
      drawWidth = offsetHeight * imgRatio;
      drawX = (offsetWidth - drawWidth) / 2;
      drawY = 0;
    }

    const pxFactor = pxFactorValues[pixelLevel] || 100;
    const isFullRes = pxFactor === 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isFullRes) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
      // Create offscreen canvas for pixelation
      const size = pxFactor * 0.01;
      const scaledW = Math.max(1, Math.floor(drawWidth * size));
      const scaledH = Math.max(1, Math.floor(drawHeight * size));
      
      const offscreen = document.createElement('canvas');
      offscreen.width = scaledW;
      offscreen.height = scaledH;
      const offCtx = offscreen.getContext('2d');
      
      offCtx.drawImage(img, 0, 0, scaledW, scaledH);
      
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, scaledW, scaledH, drawX, drawY, drawWidth, drawHeight);
    }
  }, []);

  // Render first pixelated frame as soon as image loads (ready state)
  useEffect(() => {
    if (isLoaded && !isReady) {
      renderAtLevel(0);
      setIsReady(true);
    }
  }, [isLoaded, isReady, renderAtLevel]);

  // Animate pixelation effect
  const animatePixels = useCallback(() => {
    if (pxIndexRef.current < pxFactorValues.length) {
      renderAtLevel(pxIndexRef.current);
      pxIndexRef.current++;
      
      if (pxIndexRef.current < pxFactorValues.length) {
        setTimeout(animatePixels, 80);
      } else {
        setAnimationComplete(true);
      }
    }
  }, [renderAtLevel]);

  // Handle delay
  useEffect(() => {
    if (delay > 0 && isInView && startAnimation) {
      const timer = setTimeout(() => setDelayComplete(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, isInView, startAnimation]);

  // Start animation when in view
  useEffect(() => {
    if (isReady && isInView && delayComplete && startAnimation && !animatingRef.current) {
      animatingRef.current = true;
      pxIndexRef.current = 1; // Start from second frame since first is already rendered
      animatePixels();
    }
  }, [isReady, isInView, delayComplete, startAnimation, animatePixels]);

  // Handle resize - re-render at current level
  useEffect(() => {
    if (!wrapperRef.current || !isLoaded) return;

    const handleResize = () => {
      if (animationComplete) {
        renderAtLevel(pxFactorValues.length - 1);
      } else if (isReady) {
        renderAtLevel(0);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(wrapperRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoaded, isReady, animationComplete, renderAtLevel]);

  return (
    <div ref={wrapperRef} className={`${styles.pixelatedWrapper} ${className || ''}`}>
      <canvas 
        ref={canvasRef} 
        className={styles.canvas} 
        style={{ opacity: isReady ? 1 : 0 }}
      />
      <noscript>
        <img src={src} alt={alt} className={styles.fallbackImg} />
      </noscript>
    </div>
  );
};

export default PixelatedImage;
