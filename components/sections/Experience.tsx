"use client";

/**
 * Experience.tsx
 * Clean horizontal timeline table — each row reveals on scroll with stagger.
 * Hover on row: pink accent line slides in from left.
 */

import { useState } from "react";
import { motion } from "framer-motion";

interface Role {
  company: string;
  role: string;
  period: string;
  desc: string;
  tags: string[];
}

const roles: Role[] = [
  {
    company: "Freelance / Independent",
    role: "Full Stack Developer",
    period: "2023 — Present",
    desc: "Building end-to-end web applications for startups and growing companies. Specialising in React/Next.js frontends and Node.js backends.",
    tags: ["Next.js", "Node.js", "TypeScript", "AWS"],
  },
  {
    company: "Tech Startup (Stealth)",
    role: "Frontend Lead",
    period: "2022 — 2023",
    desc: "Led a 4-person frontend team delivering a B2B analytics platform. Architected the design system, reduced bundle size by 35%, and improved deploy velocity by 50%.",
    tags: ["React", "Redux", "Tailwind", "Storybook"],
  },
  {
    company: "Agency Project",
    role: "Junior Developer",
    period: "2021 — 2022",
    desc: "Developed responsive UIs for 6 client projects across e-commerce and SaaS. Collaborated closely with designers to implement pixel-perfect interfaces.",
    tags: ["React", "CSS", "REST APIs", "Figma"],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="section-pad"
      style={{ background: "#ffffff" }}
    >
      <div className="inner">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <motion.p
              className="uppercase mb-3"
              style={{ fontSize: 11, letterSpacing: "0.2em", color: "#9a9490" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Experience
            </motion.p>
            <motion.h2
              className="font-display font-bold"
              style={{
                fontSize: "clamp(34px, 5vw, 64px)",
                letterSpacing: "-0.025em",
                color: "#0f0d0c",
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Where I&apos;ve worked.
            </motion.h2>
          </div>
        </div>

        {/* Roles */}
        <div className="flex flex-col">
          {roles.map((role, i) => (
            <RoleRow key={role.company} role={role} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleRow({ role, index }: { role: Role; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative grid grid-cols-1 md:grid-cols-[1fr_1.6fr_180px] gap-4 md:gap-8 py-8"
      style={{
        borderTop: "1px solid rgba(15,13,12,0.07)",
        paddingLeft: 16,
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent indicator line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
        style={{ background: "#e91e8c" }}
        animate={{ scaleY: hovered ? 1 : 0, originY: "top" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Left: company + role */}
      <div>
        <p
          className="font-semibold"
          style={{
            fontSize: "clamp(14px, 1.3vw, 16px)",
            color: "#0f0d0c",
            lineHeight: 1.3,
          }}
        >
          {role.company}
        </p>
        <p style={{ fontSize: 13, color: "#e91e8c", marginTop: 4 }}>
          {role.role}
        </p>
      </div>

      {/* Middle: description + tags */}
      <div>
        <p
          style={{
            fontSize: "clamp(13px, 1.1vw, 14px)",
            color: "#5a5450",
            lineHeight: 1.75,
          }}
        >
          {role.desc}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {role.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "#9a9490",
                padding: "3px 9px",
                borderRadius: 99,
                border: "1px solid rgba(15,13,12,0.1)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: period */}
      <p
        className="md:text-right"
        style={{ fontSize: 13, color: "#9a9490", whiteSpace: "nowrap" }}
      >
        {role.period}
      </p>
    </motion.div>
  );
}
