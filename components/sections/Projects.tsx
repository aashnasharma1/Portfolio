"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const projects = [
  {
    id: 1,
    title: "PhotoTools",
    tags: ["Next.js", "Cloudinary", "Clerk"],
    img: "/images/photoTools/phototools.png",
    link: "https://photogarage.vercel.app/",
  },
  {
    id: 2,
    title: "AllHeart Portal",
    tags: ["React.js", "Node.js", "MongoDB"],
    img: "/images/allHeartWeb/allHeartWeb.png",
    link: null,
  },
  {
    id: 3,
    title: "Safer Admin",
    tags: ["Vue.js", "Node.js", "MongoDB"],
    img: "/images/sapher-admin/sapher-admin.png",
    link: null,
  },
  {
    id: 4,
    title: "BlueBill OCR",
    tags: ["React.js", "Tesseract.js", "PDF.js"],
    img: "/images/billing/billing2.png",
    link: "https://blue-bill-ocr.vercel.app",
  },
];

/* ── Shared animation variants ──────────────────────────────── */
const imgV = {
  rest:  { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.65, ease: EASE } },
};

const overlayV = {
  rest:  { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.26 } },
};

const titleV = {
  rest:  { y: 10, opacity: 0 },
  hover: { y: 0,  opacity: 1, transition: { duration: 0.32, delay: 0.06, ease: EASE } },
};

const CELL_H = "clamp(240px, 28vw, 360px)";
const GAP    = "clamp(10px, 1.2vw, 16px)";

/* ── Single bento item ─────────────────────────────────────── */
function BentoItem({
  project,
  padded = false,
  index  = 0,
}: {
  project: (typeof projects)[0];
  padded?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      style={{
        height:       CELL_H,
        borderRadius: 20,
        overflow:     "hidden",
        background:   padded ? "#ede8e3" : "transparent",
        padding:      padded ? "clamp(10px, 1.2vw, 16px)" : 0,
        flexShrink:   0,
      }}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: EASE }}
    >
      {/* Image card — hover trigger for the whole overlay system */}
      <motion.div
        className="relative w-full h-full"
        style={{ borderRadius: padded ? 14 : 20, overflow: "hidden" }}
        initial="rest"
        whileHover="hover"
      >
        {/* Zoomable image */}
        <motion.div className="absolute inset-0" variants={imgV}>
          <Image
            src={project.img}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Dark overlay — fades in on hover */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-between"
          style={{
            background: "rgba(0,0,0,0.58)",
            padding:    "clamp(14px, 2vw, 22px)",
          }}
          variants={overlayV}
        >
          {/* Skill tags — stagger in from top */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                style={{
                  fontSize:        10,
                  fontWeight:      600,
                  letterSpacing:   "0.1em",
                  textTransform:   "uppercase",
                  color:           "#ffffff",
                  background:      "rgba(255,255,255,0.14)",
                  border:          "1px solid rgba(255,255,255,0.26)",
                  padding:         "5px 12px",
                  borderRadius:    99,
                  backdropFilter:  "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  display:         "inline-block",
                }}
                variants={{
                  rest:  { y: -8, opacity: 0 },
                  hover: {
                    y: 0, opacity: 1,
                    transition: { duration: 0.3, delay: 0.05 + i * 0.07, ease: EASE },
                  },
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Project title + optional link — slides up from bottom */}
          <motion.div variants={titleV}>
            <p
              style={{
                fontSize:      "clamp(16px, 1.8vw, 22px)",
                fontWeight:    700,
                color:         "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight:    1.15,
                margin:        0,
              }}
            >
              {project.title}
            </p>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           4,
                  color:         "#e91e8c",
                  fontSize:      11,
                  fontWeight:    600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop:     8,
                  textDecoration:"none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                View ↗
              </a>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Section ───────────────────────────────────────────────── */
export default function Projects() {
  return (
    <section className="section-pad" style={{ background: "var(--bg)" }}>
      <div className="inner">

        {/* Outer card */}
        <motion.div
          style={{
            background:   "#ffffff",
            borderRadius: 28,
            border:       "1px solid rgba(15,13,12,0.07)",
            boxShadow:    "0 2px 40px rgba(15,13,12,0.06)",
            padding:      "clamp(24px, 3.5vw, 48px)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Card header */}
          <div
            style={{
              display:        "flex",
              alignItems:     "baseline",
              justifyContent: "space-between",
              marginBottom:   "clamp(20px, 3vw, 36px)",
            }}
          >
            <h2
              style={{
                fontSize:      "clamp(22px, 2.8vw, 36px)",
                fontWeight:    700,
                letterSpacing: "-0.025em",
                color:         "#0f0d0c",
                margin:        0,
              }}
            >
              Selected Work
            </h2>
            <span
              style={{
                fontSize:      11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color:         "#9a9490",
              }}
            >
              {projects.length} Projects
            </span>
          </div>

          {/* Bento grid — two rows with mirrored column ratios */}
          <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>

            {/* Row 1 — wide padded  |  narrow full-bleed */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: GAP }}>
              <BentoItem project={projects[0]} padded index={0} />
              <BentoItem project={projects[1]}        index={1} />
            </div>

            {/* Row 2 — narrow full-bleed  |  wide padded */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: GAP }}>
              <BentoItem project={projects[2]}        index={2} />
              <BentoItem project={projects[3]} padded index={3} />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
