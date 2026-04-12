"use client";

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
    <section className="section-pad" style={{ background: "#fff8f9" }}>
      <div className="inner">
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

  const content = (
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
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Image
            src={project.img}
            alt={project.title}
            fill
            className="object-cover object-top"
          />
        </motion.div>

        <div className="absolute top-4 left-4 text-xs bg-white/80 px-3 py-1 rounded-full">
          {project.year}
        </div>
      </div>

      {/* Text */}
      <div
        className="flex flex-col justify-between p-8"
        style={{ order: index % 2 === 0 ? 2 : 1 }}
      >
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border px-2 py-1 rounded-full text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-bold">{project.title}</h3>

          <p className="text-sm text-gray-600 mt-3">{project.desc}</p>
        </div>

        {project.link && (
          <motion.div
            className="flex items-center gap-2 mt-6 text-pink-500 font-semibold text-sm"
            animate={{ x: hovered ? 6 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span>View Project</span>
            <span>→</span>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className="group rounded-2xl overflow-hidden border"
      style={{
        borderColor: hovered
          ? "rgba(233,30,140,0.3)"
          : "rgba(0,0,0,0.08)",
      }}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}