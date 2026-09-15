'use client';
import styles from './style.module.scss';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import Laptop3D from './Laptop3D';

const projects = [
  {
    name: 'InsightFlow',
    category: 'Full-stack SaaS',
    description: 'Feedback platform with live analytics for product teams.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    year: '2026',
    url: 'https://insightflow-aashna.vercel.app/',
    image: 'insightflow.jpg'
  },
  {
    name: 'GitPulse',
    category: 'Developer tooling',
    description: 'GitHub bot that labels issues and pings Slack from your rules.',
    tags: ['Next.js', 'GitHub API', 'Webhooks', 'Slack'],
    url: 'https://github-event-automation.vercel.app/',
    image: 'gitpulse.jpg'
  },
  {
    name: 'PhotoTools',
    category: 'AI image editor',
    description: 'Restore, generative fill, object removal and recolor with AI.',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'AI'],
    year: '2025',
    url: 'https://phototools-ai.vercel.app/',
    image: 'phototools.jpg'
  },
  {
    name: 'AashTrack',
    category: 'Productivity app',
    description: 'Minimal task manager with workload view and time tracking.',
    tags: ['Next.js', 'React'],
    url: 'https://aashtrack.vercel.app/',
    image: 'aashtrack.jpg'
  }
];

const headingReveal = {
  initial: { y: '100%' },
  open: (i) => ({
    y: '0%',
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

// Wraps the WebGL laptop in a link, with the warm light behind it
function Laptop({ project, rotation, onReady }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.scene}
      data-cursor="Visit"
      aria-label={`Open ${project.name} live site`}
    >
      <span className={styles.halo} data-halo aria-hidden="true" />
      <Laptop3D image={project.image} rotation={rotation} onReady={onReady} />
    </a>
  );
}

export default function Projects() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const [active, setActive] = useState(0);
  // Scroll animations write each laptop's yaw here; the 3D view re-renders on change
  const rotations = useRef(projects.map(() => ({ ry: -0.2 })));
  const laptops = useRef([]);

  // Pin the stage and glide the gallery sideways as you scroll (all screen sizes).
  // The centred project is enlarged, lit and turned toward you; the rest recede.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add({ phone: '(max-width: 767px)', wide: '(min-width: 768px)' }, (context) => {
      const { phone } = context.conditions;
      const pin = pinRef.current;
      const track = trackRef.current;
      const cards = gsap.utils.toArray('[data-card]', track);
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          // Phones pin the (shorter) stage mid-screen so it sits right under the heading
          start: phone ? 'center center' : 'top top',
          // Extra scroll length so each project lingers in the spotlight
          end: () => `+=${Math.round(distance() * (phone ? 1.3 : 1.6))}`,
          pin: true,
          anticipatePin: 1,
          // The section is a flex column, where GSAP defaults pinSpacing to false
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true
        },
        // Runs on every frame of the smoothed movement, so the counter never lags
        onUpdate() {
          const progress = this.progress();
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
          const mid = window.innerWidth / 2;
          let current = 0;
          let best = Infinity;
          cards.forEach((card, i) => {
            const r = card.getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - mid);
            if (d < best) { best = d; current = i; }
          });
          setActive((prev) => (prev === current ? prev : current));
        }
      });

      // The project in the spotlight grows past its resting size
      const focusScale = phone ? 1.06 : 1.14;

      cards.forEach((card, i) => {
        const turn = rotations.current[i];
        const redraw = () => laptops.current[i]?.render();
        const halo = card.querySelector('[data-halo]');
        const body = card.querySelector('[data-body]');
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: card,
            containerAnimation: slide,
            start: 'left right',
            end: 'right left',
            scrub: true
          }
        })
          // entering from the right: small, dim, screen angled toward the centre
          .fromTo(card, { scale: 0.72, opacity: 0.4 }, { scale: focusScale, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
          .fromTo(turn, { ry: 0.5 }, { ry: -0.22, duration: 1, ease: 'power1.out', onUpdate: redraw }, 0)
          .fromTo(halo, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.in' }, 0)
          .fromTo(body, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.in' }, 0)
          // leaving to the left: keep turning and recede
          .to(card, { scale: 0.72, opacity: 0.4, duration: 1, ease: 'power2.in' }, 1)
          .to(turn, { ry: -0.85, duration: 1, ease: 'power1.in', onUpdate: redraw }, 1)
          .to(halo, { opacity: 0, duration: 1, ease: 'power2.out' }, 1)
          .to(body, { opacity: 0, y: 16, duration: 1, ease: 'power3.out' }, 1);
      });
    });

    return () => mm.revert();
  }, []);

  const heading = 'Proof of Work /';

  return (
    <section className={styles.projects}>
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>
          {heading.split(' ').map((word, i) => (
            <span key={i} className={styles.word}>
              <motion.span
                variants={headingReveal}
                initial="initial"
                whileInView="open"
                viewport={{ once: true, margin: '-80px' }}
                custom={i}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>
        <span className={styles.count}>( {String(projects.length).padStart(2, '0')} )</span>
      </div>

      <div className={styles.subtextContainer}>
        <span className={styles.label}>( Selected projects )</span>
        <p className={styles.subtext}>Live products I&apos;ve designed, built and shipped.</p>
      </div>

      <div ref={pinRef} className={styles.pin}>
        <div ref={trackRef} className={styles.track}>
          {projects.map((project, i) => (
            <article key={project.name} className={styles.card} data-card>
              <Laptop
                project={project}
                rotation={rotations.current[i]}
                onReady={(api) => { laptops.current[i] = api; }}
              />

              <div className={styles.body} data-body>
                <div className={styles.meta}>
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.category}>
                    {project.category}{project.year ? ` · ${project.year}` : ''}
                  </span>
                </div>

                <div className={styles.titleRow}>
                  <h3 className={styles.name}>{project.name}</h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visit}
                    data-cursor="Visit"
                    aria-label={`Visit ${project.name}`}
                  >
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                </div>

                <p className={styles.description}>{project.description}</p>

                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.progressRow} aria-hidden="true">
          <span className={styles.counter}>
            <span className={styles.counterCurrent}>{String(active + 1).padStart(2, '0')}</span>
            {' / '}
            {String(projects.length).padStart(2, '0')}
          </span>
          <span className={styles.progressTrack}>
            <span ref={fillRef} className={styles.progressFill} />
          </span>
          <span className={styles.hint}>Scroll</span>
        </div>
      </div>
    </section>
  );
}
