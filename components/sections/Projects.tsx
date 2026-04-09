"use client";

/**
 * Projects.tsx
 * Alternating full-width project rows.
 * Each row: large image on one side, text on the other.
 * Hover: image scales up (1 → 1.04), accent border appears.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  tags: string[];
  year: string;
  desc: string;
  img: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    year: "2024",
    desc: "Full-featured e-commerce platform with real-time inventory, multi-vendor support, and a 40% improvement in checkout conversion through UX optimisation.",
    img: "/images/profile.jpg", // placeholder — replace with project screenshots
    link: "#",
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    tags: ["React", "Node.js", "AWS", "Tailwind"],
    year: "2024",
    desc: "Analytics dashboard for a B2B SaaS product serving 5000+ daily active users. Reduced bundle by 35% and improved initial load by 2.1s.",
    img: "/images/profile.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Design System",
    tags: ["React", "Storybook", "Radix UI", "CSS"],
    year: "2023",
    desc: "Component library and design system used across 3 internal products. 80+ components, full accessibility compliance, dark-mode support.",
    img: "/images/profile.jpg",
    link: "#",
  },
  {
    id: 4,
    title: "Real-time Collaboration Tool",
    tags: ["WebSockets", "Next.js", "Redis", "Prisma"],
    year: "2023",
    desc: "Notion-style collaborative document editor with live presence, conflict-free editing, and sub-100ms latency at scale.",
    img: "/images/profile.jpg",
    link: "#",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  }),
};

export default function Projects() {
  return (
    <section
      id="projects"
      className="section-pad"
      style={{ background: "#fff8f9" }}
    >
      <div className="inner">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <motion.p
              className="uppercase mb-3"
              style={{ fontSize: 11, letterSpacing: "0.2em", color: "#9a9490" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Selected Work
            </motion.p>
            <motion.h2
              className="font-display font-bold"
              style={{
                fontSize: "clamp(34px, 5vw, 64px)",
                letterSpacing: "-0.025em",
                color: "#0f0d0c",
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Things I&apos;ve built.
            </motion.h2>
          </div>

          <motion.p
            className="hidden md:block text-right max-w-[220px]"
            style={{ fontSize: 13, color: "#9a9490", lineHeight: 1.7 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            A selection of recent projects across web development & design.
          </motion.p>
        </div>

        {/* Project list */}
        <div className="flex flex-col gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: "#ffffff",
        border: hovered
          ? "1px solid rgba(233,30,140,0.20)"
          : "1px solid rgba(15,13,12,0.07)",
        transition: "border-color 0.3s ease",
      }}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={project.link} className="no-underline">
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ minHeight: 340 }}
        >
          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{
              order: index % 2 === 0 ? 1 : 2,
              background: "#fff0f6",
              minHeight: 280,
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={project.img}
                alt={project.title}
                fill
                className="object-cover object-top"
              />
            </motion.div>

            {/* Year tag */}
            <div
              className="absolute top-4 left-4"
              style={{
                background: "rgba(255,248,249,0.9)",
                backdropFilter: "blur(8px)",
                padding: "5px 12px",
                borderRadius: 99,
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#0f0d0c",
              }}
            >
              {project.year}
            </div>
          </div>

          {/* Text */}
          <div
            className="flex flex-col justify-between p-8 md:p-10"
            style={{ order: index % 2 === 0 ? 2 : 1 }}
          >
            <div>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      color: "#9a9490",
                      padding: "3px 10px",
                      borderRadius: 99,
                      border: "1px solid rgba(15,13,12,0.1)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(22px, 2.8vw, 36px)",
                  letterSpacing: "-0.02em",
                  color: "#0f0d0c",
                  lineHeight: 1.15,
                }}
              >
                {project.title}
              </h3>

              <p
                style={{
                  fontSize: "clamp(13px, 1.2vw, 15px)",
                  color: "#5a5450",
                  lineHeight: 1.75,
                  marginTop: 14,
                }}
              >
                {project.desc}
              </p>
            </div>

            {/* View link */}
            <motion.div
              className="flex items-center gap-2 mt-8"
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#e91e8c",
                }}
              >
                View Project
              </span>
              <span style={{ color: "#e91e8c", fontSize: 16 }}>→</span>
            </motion.div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
