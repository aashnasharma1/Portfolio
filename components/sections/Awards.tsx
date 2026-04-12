"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Achievement {
  title: string;
  organizer: string;
  prize: string;
  year: string;
  description: string;
  tags: string[];
  images: string[];
}

const achievements: Achievement[] = [
  {
    title: "2nd Place — The Great India Hackathon",
    organizer: "Reskill",
    prize: "₹20,000 Cash Prize",
    year: "2023",
    description:
      "Built Connector — a tool enabling instant transfer of OTPs, links, texts, and media files between devices, seamlessly bridging laptops and mobiles. Ideated and implemented in just 24 hours.",
    tags: ["Innovation", "24hrs", "Cross-device"],
    images: ["/images/reskillHackathon.jpeg"],
  },
  {
    title: "Winner — Smart App Development Hackathon",
    organizer: "Chitkara University × DigiMantra",
    prize: "1st Place",
    year: "2023",
    description:
      "Won with team member Kirti Pahwa by building an online ticketing application with a unique user satisfaction feature — an idea with real commission potential. Built end-to-end in 24 hours.",
    tags: ["DigiHackDay", "24hrs", "SmartHackathon2023"],
    images: [
      "/images/digimantraHackathon1.jpeg",
      "/images/digimantraHackathon2.jpeg",
      "/images/digimantraHackathon3.jpeg",
    ],
  },
];

export default function Achievements() {
  return (
    <section
      id="achievements"
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
              Achievements
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
              What I&apos;ve won.
            </motion.h2>
          </div>
        </div>

        {/* Achievement rows */}
        <div className="flex flex-col">
          {achievements.map((item, i) => (
            <AchievementRow key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementRow({ item, index }: { item: Achievement; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative py-10"
      style={{
        borderTop: "1px solid rgba(15,13,12,0.07)",
        paddingLeft: 16,
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
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
        style={{ background: "#e91e8c", originY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left — Info */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "#e91e8c",
                  padding: "3px 10px",
                  borderRadius: 99,
                  border: "1px solid rgba(233,30,140,0.25)",
                  background: "rgba(233,30,140,0.05)",
                }}
              >
                {item.prize}
              </span>
              <span style={{ fontSize: 12, color: "#9a9490" }}>
                {item.year}
              </span>
            </div>

            <p
              className="font-semibold"
              style={{
                fontSize: "clamp(15px, 1.4vw, 18px)",
                color: "#0f0d0c",
                lineHeight: 1.3,
                marginBottom: 4,
              }}
            >
              {item.title}
            </p>
            <p style={{ fontSize: 13, color: "#e91e8c", marginBottom: 12 }}>
              {item.organizer}
            </p>
            <p
              style={{
                fontSize: "clamp(13px, 1.1vw, 14px)",
                color: "#5a5450",
                lineHeight: 1.75,
              }}
            >
              {item.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
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
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Images */}
        <div
          className={`grid gap-3 ${
            item.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {item.images.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{
                borderRadius: 12,
                background: "#f5f4f2",
                gridColumn:
                  item.images.length === 3 && i === 0 ? "span 2" : "span 1",
                height:
                  item.images.length === 1
                    ? 280
                    : item.images.length === 3 && i === 0
                      ? 200
                      : 150,
              }}
            >
              <Image
                src={src}
                alt={`${item.title} photo ${i + 1}`}
                fill
                className="object-cover"
                style={{ borderRadius: 12 }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
