"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonSlide from "@/components/ui/ButtonSlide";

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/aashnasharma1" },
  { label: "GitHub", href: "https://github.com/aashnasharma1" },
  { label: "Email", href: "mailto:aashnajuyal@gmail.com" },
];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
];

const MARQUEE_TEXT = "LET'S TALK";
const REPEAT = 8;

/* ── cream palette (footer-local) ──────────────────────────── */
const BG_BODY = "#fdfaf4";     /* near-white warm cream — footer body */
const BG_BOTTOM = "#f7f0e4";   /* soft warm base                      */
const BORDER = "rgba(15,13,12,0.1)";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST",
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>

      {/* ── CTA band ───────────────────────────────────────────── */}
      <div
        style={{
          background: BG_BODY,
          padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px) clamp(40px, 5vw, 64px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9a9490",
                marginBottom: 14,
              }}
            >
              Have a project in mind?
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "#0f0d0c",
                margin: 0,
              }}
            >
              Let&apos;s build something{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "#e91e8c",
                  fontFamily: "var(--font-playfair, Georgia, serif)",
                }}
              >
                great.
              </em>
            </h2>
          </div>

          <ButtonSlide href="mailto:aashnajuyal@gmail.com">
            Get in touch →
          </ButtonSlide>
        </div>
      </div>

      {/* ── Links grid ─────────────────────────────────────────── */}
      <div
        style={{
          background: BG_BODY,
          padding: "40px clamp(20px, 4vw, 64px) 48px",
        }}
      >
        {/* Column labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9a9490",
            }}
          >
            (Follow)
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9a9490",
            }}
          >
            (Navigation)
          </span>
        </div>

        {/* Hairline */}
        <div style={{ height: 1, background: BORDER, marginBottom: 18 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "end",
          }}
        >
          {/* Social */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {socialLinks.map((l) => (
              <li key={l.href} style={{ lineHeight: 1 }}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    fontSize: "clamp(14px, 1.15vw, 17px)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#0f0d0c",
                    textDecoration: "none",
                    paddingBottom: 10,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#e91e8c")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#0f0d0c")
                  }
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "none",
              border: `1px solid ${BORDER}`,
              borderRadius: 99,
              cursor: "pointer",
              color: "#9a9490",
              fontFamily: "inherit",
              padding: "10px 20px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#e91e8c";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(233,30,140,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#9a9490";
              (e.currentTarget as HTMLElement).style.borderColor = BORDER;
            }}
          >
            ↑ Top
          </button>

          {/* Nav */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, textAlign: "right" }}>
            {navLinks.map((l) => (
              <li key={l.href} style={{ lineHeight: 1 }}>
                <Link
                  href={l.href}
                  style={{
                    display: "block",
                    fontSize: "clamp(14px, 1.15vw, 17px)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#0f0d0c",
                    textDecoration: "none",
                    paddingBottom: 10,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#e91e8c")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#0f0d0c")
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Marquee accent band ────────────────────────────────── */}
      <div
        style={{
          background: "#e91e8c",
          overflow: "hidden",
          padding: "14px 0",
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "mailto:aashnajuyal@gmail.com")}
      >
        <div className="footer-marquee-track">
          {Array.from({ length: REPEAT }).map((_, i) => (
            <span key={i} className="footer-marquee-item">
              {MARQUEE_TEXT}&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
          {Array.from({ length: REPEAT }).map((_, i) => (
            <span key={`d${i}`} className="footer-marquee-item" aria-hidden>
              {MARQUEE_TEXT}&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────────────────── */}
      <div
        style={{
          background: BG_BOTTOM,
          padding: "18px clamp(20px, 4vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 2vw, 28px)" }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9a9490",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Pink dot — the one permitted accent touch */}
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#e91e8c",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Chandigarh, IN
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9a9490",
            }}
          >
            {time}&nbsp;&nbsp;GMT+5:30
          </span>
        </div>

        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9a9490",
            textAlign: "right",
          }}
        >
          ©2025 Aashna Sharma&nbsp;&nbsp;/&nbsp;&nbsp;All rights reserved
        </span>
      </div>
    </footer>
  );
}
