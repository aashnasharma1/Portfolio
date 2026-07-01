'use client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './AnimatedShape.css';

export default function AnimatedShape({ type }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    if (type === 'Frontend Development') {
      // Lines animation for Frontend
      const lineOrigin = svgRef.current.querySelector('.line-origin');
      const numOfLines = 20;

      for (let i = 0; i < numOfLines; i++) {
        const clonedPath = lineOrigin.cloneNode(true);
        clonedPath.classList.remove('line-origin');
        clonedPath.classList.add('line-clone');
        svgRef.current.appendChild(clonedPath);
      }

      const lines = gsap.utils.toArray('.line-clone', svgRef.current);
      
      lines.forEach((line, i) => {
        gsap.set(line, {
          rotate: (i * 180) / numOfLines,
          transformOrigin: "center",
          strokeDasharray: 100,
          strokeDashoffset: 0
        });
      });

      gsap.to(lines, {
        rotate: "+=360",
        ease: "power3.inOut",
        repeat: -1,
        stagger: 0.1,
        duration: 4
      });

      gsap.to(lines, {
        strokeDashoffset: 50,
        duration: 2,
        ease: "power3.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.1
      });

    } else if (type === 'Web Performance') {
      // Arrows animation
      const arrowTL = gsap.timeline({ repeat: -1 });
      
      arrowTL.to("#arrow-1", {
        scale: 0,
        transformOrigin: "top center",
        duration: 1,
        ease: "power3.inOut"
      })
      .to("#arrow-2", {
        y: -50,
        duration: 1,
        ease: "power3.inOut"
      }, "<")
      .to("#arrow-3", {
        y: -50,
        duration: 1,
        ease: "power3.inOut"
      })
      .to("#arrow-2", {
        scale: 0,
        transformOrigin: "top center",
        duration: 1,
        ease: "power3.inOut"
      })
      .to("#arrow-3", {
        y: -100,
        duration: 1,
        ease: "power3.inOut"
      }, "<")
      .to("#arrow-4", {
        y: -100,
        duration: 1,
        ease: "power3.inOut"
      });

    } else if (type === 'System Architecture') {
      // Stretch bars animation
      gsap.to('.bar', {
        y: -5,
        duration: 1,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1
      });

      // Bar 1 - stretch and circle movement
      gsap.to('#bar-1', {
        scaleY: 0.5,
        transformOrigin: "center",
        duration: 1,
        ease: "power3.inOut",
        repeat: -1,
        yoyo: true
      });
      gsap.to('#bar-1-circle-1', {
        y: 40,
        duration: 1,
        ease: "power3.inOut",
        repeat: -1,
        yoyo: true
      });

      // Bar 2 - stretch and circle movement
      gsap.to('#bar-2', {
        scaleY: 0.4,
        transformOrigin: "center",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
      gsap.to('#bar-2-circle-2', {
        y: -40,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });

      // Bar 3 - stretch and circle movement
      gsap.to('#bar-3', {
        scaleY: 0.6,
        transformOrigin: "center",
        duration: 2,
        ease: "circ",
        repeat: -1,
        yoyo: true
      });
      gsap.to('#bar-3-circle-1', {
        y: 30,
        duration: 2,
        ease: "circ",
        repeat: -1,
        yoyo: true
      });

    } else {
      // Ellipse animation for Backend/System Architecture
      const ellipsOrigin = svgRef.current.querySelector('.ellipse-origin');
      const numOfEllipses = 7;

      // Create color gradient from #85885cff to lighter shades
      const colors = [
        '#f7f9d9ff', // darkest olive-green
        '#dadcb6ff',
        '#b9bc8dff',
        '#a6a97bff',
        '#a4a775ff',
        '#a1a474ff',
        '#85885cff'  // light cream with green undertones
      ];

      for (let i = 0; i < numOfEllipses; i++) {
        const clonedPath = ellipsOrigin.cloneNode(true);
        clonedPath.classList.remove('ellipse-origin');
        clonedPath.classList.add('ellipse-clone');
        clonedPath.setAttribute('fill', colors[i]);
        svgRef.current.appendChild(clonedPath);
      }

      const ellipses = gsap.utils.toArray('.ellipse-clone', svgRef.current);
      
      ellipses.forEach((ellipse) => {
        gsap.set(ellipse, {
          transformOrigin: "bottom center"
        });
      });

      gsap.to(ellipses, {
        y: 50,
        ease: "power3.inOut",
        stagger: 0.1,
        repeat: -1,
        duration: 1,
        yoyo: true
      });
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gsap.killTweensOf(svgRef.current);
    };
  }, [type]);

  if (type === 'Frontend Development' || type === 'Web Development') {
    return (
      <div className="animated-shape-box">
        <svg 
          ref={svgRef}
          className="animated-svg" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 100"
        >
          <path 
            className="line-origin" 
            fill="none" 
            stroke="#85885cff" 
            strokeMiterlimit="10" 
            strokeWidth="1" 
            strokeLinecap="round" 
            d="M50 9.95v80.32" 
          />
        </svg>
      </div>
    );
  }

  if (type === 'Web Performance') {
    return (
      <div className="animated-shape-box">
        <svg 
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 200"
        >
          <defs>
            <clipPath id="arrow-clip">
              <path fill="none" d="M0 0h100v100H0z" />
            </clipPath>
          </defs>
          <g clipPath="url(#arrow-clip)">
            <path id="arrow-1" d="M50 0 0 50h100L50 0z" fill="#85885cff" />
            <path id="arrow-2" d="M50 50 0 100h100L50 50z" fill="#85885cff" opacity="0.7" />
            <path id="arrow-3" d="M50 100 0 150h100l-50-50z" fill="#85885cff" />
            <path id="arrow-4" d="M50 150 0 200h100l-50-50z" fill="#85885cff" opacity="0.7" />
          </g>
        </svg>
      </div>
    );
  }

  if (type === 'System Architecture') {
    return (
      <div className="animated-shape-box">
        <svg 
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 100"
        >
          <g className="bar">
            <path id="bar-1" d="M71.97 6.27c-6.07 0-10.98 4.92-10.98 10.98v52.27c0 6.07 4.92 10.98 10.98 10.98s10.98-4.92 10.98-10.98V17.25c0-6.07-4.92-10.98-10.98-10.98Z" fill="#d4d3c8" />
            <circle id="bar-1-circle-1" cx="71.97" cy="17.25" r="10.98" fill="#85885cff" />
            <circle cx="71.97" cy="69.52" r="10.98" fill="#6b6b5a" />
          </g>
          <g className="bar">
            <path id="bar-2" d="M50 22.42c-6.07 0-10.98 4.92-10.98 10.98v52.27c0 6.07 4.92 10.98 10.98 10.98s10.98-4.92 10.98-10.98V33.4c0-6.07-4.92-10.98-10.98-10.98Z" fill="#c5c3b8" />
            <circle cx="50" cy="33.41" r="10.98" fill="#6b6b5a" />
            <circle id="bar-2-circle-2" cx="50" cy="85.68" r="10.98" fill="#85885cff" />
          </g>
          <g className="bar">
            <path id="bar-3" d="M28.15 7.27c-6.07 0-10.98 4.92-10.98 10.98v52.27c0 6.07 4.92 10.98 10.98 10.98s10.98-4.92 10.98-10.98V18.26c0-6.07-4.92-10.98-10.98-10.98Z" fill="#b8b6ab" />
            <circle id="bar-3-circle-1" cx="28.15" cy="18.26" r="10.98" fill="#6b6b5a" />
            <circle cx="28.15" cy="70.53" r="10.98" fill="#85885cff" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="animated-shape-box">
      <svg 
        ref={svgRef}
        className="animated-svg" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100"
      >
        <ellipse 
          className="ellipse-origin" 
          cx="50" 
          cy="25" 
          fill="#85885cff" 
          rx="50" 
          ry="25" 
        />
      </svg>
    </div>
  );
}
