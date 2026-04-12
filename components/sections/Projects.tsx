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
  link: string | null;
}

const projects: Project[] = [
  {
    id: 1,
    title: "PhotoTools",
    tags: ["Next.js", "Cloudinary API", "Clerk", "TypeScript"],
    year: "2026",
    desc: "An AI-powered photo editing application built with Next.js server-side components for performance. Features include background removal, generative fill, aspect ratio manipulation, and seamless auth via Clerk — all powered by Cloudinary's transformation API.",
    img: "/images/photoTools/phototools.png",
    link: "https://photogarage.vercel.app/",
  },
  {
    id: 2,
    title: "AllHeart — Employee Management Portal",
    tags: ["React.js", "Redux", "Node.js", "MongoDB", "REST APIs"],
    year: "2025",
    desc: "A full-stack internal HR portal built from scratch for AllHeart Web. Features attendance tracking, leave management, task assignments, project tracking, salary increments, and user activity logs — used daily across the organization.",
    img: "/images/allHeartWeb/allHeartWeb.png",
    link: null,
  },
  {
    id: 3,
    title: "Safer — Admin Portal",
    tags: ["Vue.js", "Vuex", "Node.js", "MongoDB", "REST APIs"],
    year: "2025",
    desc: "A secure admin portal for an organizational cybersecurity platform. Enables top-level management to monitor website access requests, block malicious URLs, manage employee permissions, and review safety scores across the organization.",
    img: "/images/sapher-admin/sapher-admin.png",
    link: null,
  },
  {
    id: 4,
    title: "BlueBill OCR",
    tags: ["React.js", "Tesseract.js", "Redux", "Tailwind CSS", "PDF.js"],
    year: "2024",
    desc: "A browser-based billing scanner that extracts text from invoice images using Tesseract.js OCR — no backend required. Supports drag-and-drop uploads, live webcam capture, and PDF parsing.",
    img: "/images/billing/billing2.png",
    link: "https://blue-bill-ocr.vercel.app",
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
              {project.link !== null && (
                <>
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
                </>
              )}
            </motion.div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
