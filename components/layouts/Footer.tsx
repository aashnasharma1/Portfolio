"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/aashnasharma" },
  { label: "GitHub", href: "https://github.com/aashnasharma1" },
  { label: "Email", href: "mailto:hello@aashnasharma.co" },
];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
];

const MARQUEE_TEXT = "LET'S TALK";
const REPEAT = 8;

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      style={{
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
      }}
    >
      {/* ── Top: (follow) / (navigation) ── */}
      <div
        style={{
          background: "var(--bg)",
          padding: "56px clamp(20px, 4vw, 64px) 0",
        }}
      >
        {/* Label row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            (Follow)
          </span>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            (Navigation)
          </span>
        </div>

        {/* Hairline */}
        <div
          style={{
            height: 1,
            background: "var(--border-md)",
            marginBottom: "16px",
          }}
        />

        {/* Links grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "end",
            paddingBottom: "48px",
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
                    color: "var(--text-heading)",
                    textDecoration: "none",
                    paddingBottom: "10px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--text-heading)")
                  }
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Back to top — centered */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontFamily: "inherit",
              padding: "0 24px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--accent)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "var(--text-muted)")
            }
          >
            Back to top
          </button>

          {/* Nav */}
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              textAlign: "right",
            }}
          >
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
                    color: "var(--text-heading)",
                    textDecoration: "none",
                    paddingBottom: "10px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color =
                      "var(--text-heading)")
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Marquee band ── */}
      <div
        style={{
          background: "var(--accent)",
          overflow: "hidden",
          padding: "16px 0",
          cursor: "pointer",
        }}
        onClick={() =>
          (window.location.href = "mailto:hello@aashnasharma.co")
        }
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

      {/* ── Bottom strip ── */}
      <div
        style={{
          background: "#ede8e3",
          borderTop: "1px solid rgba(15,13,12,0.14)",
          padding: "20px clamp(20px, 4vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 2vw, 32px)" }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9a9490",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-inter, sans-serif)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#9a9490",
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
              fontFamily: "var(--font-inter, sans-serif)",
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
            fontFamily: "var(--font-inter, sans-serif)",
          }}
        >
          ©2025 Aashna Sharma&nbsp;&nbsp;/&nbsp;&nbsp;All rights reserved
        </span>
      </div>
    </footer>
  );
}
