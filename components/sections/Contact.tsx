"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const email = "aashna@example.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="section-pad"
      style={{ background: "#fff8f9" }}
    >
      <div className="inner">
        <motion.p
          className="uppercase mb-4"
          style={{ fontSize: 11, letterSpacing: "0.2em", color: "#9a9490" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Get in touch
        </motion.p>

        {/* Big CTA headline */}
        <div className="overflow-hidden mb-10">
          <motion.h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(44px, 8vw, 120px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: "#0f0d0c",
            }}
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            Let&apos;s work
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px #e91e8c",
                color: "transparent",
              }}
            >
              together.
            </span>
          </motion.h2>
        </div>

        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              fontSize: "clamp(14px, 1.3vw, 16px)",
              color: "#5a5450",
              lineHeight: 1.8,
              maxWidth: 440,
            }}
          >
            Have a project in mind or want to collaborate? I&apos;m always open
            to new opportunities and interesting problems.
          </p>

          <div className="flex flex-col gap-3">
            {/* Email copy button */}
            <motion.button
              onClick={copyEmail}
              className="flex items-center gap-3 rounded-full text-left"
              style={{
                background: "#0f0d0c",
                color: "#fff8f9",
                padding: "14px 28px",
                fontSize: "clamp(13px, 1.2vw, 15px)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                border: "none",
                cursor: "none",
              }}
              whileHover={{ backgroundColor: "#e91e8c", scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {copied ? "Copied! ✓" : email}
              <span style={{ fontSize: 18 }}>{copied ? "" : "↗"}</span>
            </motion.button>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-1">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Twitter", href: "https://twitter.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline transition-colors duration-200"
                  style={{
                    fontSize: 13,
                    color: "#9a9490",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e91e8c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#9a9490")
                  }
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
