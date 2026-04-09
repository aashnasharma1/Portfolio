"use client";

/**
 * About.tsx
 * Two-column layout: large pull-quote on left, bio + skills on right.
 * Content reveals on scroll using Framer Motion's whileInView.
 */

import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "PostgreSQL", "REST APIs"],
  },
  { category: "Tooling", items: ["Git", "Figma", "Vercel", "AWS"] },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: EASE },
  }),
};

export default function About() {
  return (
    <section
      id="about"
      className="section-pad"
      style={{ background: "#ffffff" }}
    >
      <div className="inner">
        {/* Section label */}
        <motion.p
          className="uppercase tracking-widest mb-12"
          style={{ fontSize: 11, color: "#9a9490", letterSpacing: "0.2em" }}
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          About me
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* ── Left: big pull-quote + image ─────────────── */}
          <div>
            <motion.h2
              className="font-display font-bold"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "#0f0d0c",
              }}
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              Crafting digital
              <br />
              experiences that{" "}
              <em
                className="not-italic"
                style={{
                  color: "#e91e8c",
                  WebkitTextStroke: "1px #e91e8c",
                  textDecoration: "none",
                }}
              >
                matter.
              </em>
            </motion.h2>

            {/* Photo */}
            <motion.div
              className="relative mt-10 overflow-hidden rounded-2xl"
              style={{ aspectRatio: "4/5", background: "#fff0f6" }}
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <Image
                src="/images/profile.jpg"
                alt="Aashna Sharma"
                fill
                className="object-cover object-top"
              />
              {/* Name card overlay */}
              <div
                className="absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,248,249,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(233,30,140,0.1)",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f0d0c" }}>
                  Aashna Sharma
                </p>
                <p style={{ fontSize: 11, color: "#9a9490", marginTop: 2 }}>
                  Full Stack Developer · Chandigarh, India
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: bio + skills ───────────────────────── */}
          <div className="flex flex-col gap-10 pt-0 md:pt-2">
            <motion.p
              style={{
                fontSize: "clamp(15px, 1.4vw, 17px)",
                lineHeight: 1.8,
                color: "#5a5450",
              }}
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              I&apos;m a full stack developer with 2+ years of experience
              building production-grade web applications. I focus on the
              intersection of design and engineering — writing clean, performant
              code while keeping an eye on the user experience.
            </motion.p>

            <motion.p
              style={{
                fontSize: "clamp(14px, 1.3vw, 16px)",
                lineHeight: 1.8,
                color: "#5a5450",
              }}
              variants={fadeUp}
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              I&apos;ve led frontend teams, shipped scalable systems end-to-end,
              and reduced bundle sizes by 35% on production apps. I care deeply
              about performance, accessibility, and the craft of building things
              that last.
            </motion.p>

            {/* Skills grid */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-2"
              variants={fadeUp}
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {skills.map((group) => (
                <div key={group.category}>
                  <p
                    className="uppercase mb-3"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "#9a9490",
                    }}
                  >
                    {group.category}
                  </p>
                  <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li key={item} style={{ fontSize: 13, color: "#0f0d0c" }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>

            {/* Services */}
            <motion.div
              className="flex flex-col gap-3 pt-4"
              style={{ borderTop: "1px solid rgba(15,13,12,0.07)" }}
              variants={fadeUp}
              custom={5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <p
                className="uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "#9a9490",
                }}
              >
                Services
              </p>
              {[
                "Full Stack Web Development",
                "UI/UX Engineering",
                "Performance Optimization",
                "Technical Consulting",
              ].map((service, i) => (
                <motion.div
                  key={service}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: "1px solid rgba(15,13,12,0.07)" }}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span
                    style={{
                      fontSize: "clamp(13px, 1.2vw, 15px)",
                      color: "#0f0d0c",
                    }}
                  >
                    {service}
                  </span>
                  <span style={{ color: "#e91e8c", fontSize: 16 }}>→</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
